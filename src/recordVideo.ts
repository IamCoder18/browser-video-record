import { PuppeteerExtra } from "puppeteer-extra";
import * as path from "node:path";
import { Logger } from "./logger"; // Added logDirectory
import { Target, recordingDirectory, videoPlayerSelector, logDirectory } from "./config";
import { launchConfiguredBrowser, closeBrowser } from "./browserManager";
import { setupNewPage, navigateToUrl, prepareVideoPlayer, playVideo } from "./pageUtils";
import { startMediaStreamRecording, stopMediaStreamRecording } from "./streamRecorder";
import { delay, sanitizeFileName } from "./utils";

export async function recordVideo(
    puppeteerInstance: PuppeteerExtra,
    target: Target,
    instanceRunId: string | number // Unique ID for this specific recording run (e.g., loop index)
): Promise<void> {
    const logger = new Logger(target.title, instanceRunId);
    // checkEnvVars(); // Call if/when login logic is active and required

    logger.log(`Starting recording for URL: ${target.url}`);
    logger.log(`Target video ID: ${target.id}, Requested duration: ${target.videoLength} minute(s)`);

    let browser: any = null;

    try {
        browser = await launchConfiguredBrowser(puppeteerInstance, instanceRunId, logger);
        const page: any = await setupNewPage(browser, logger);

        await navigateToUrl(page, target.url, logger);
        await prepareVideoPlayer(page, logger, videoPlayerSelector); // Uses default selector from config

        await delay(2000); // Delay to allow video player to settle before recording starts

        const saneTitle = sanitizeFileName(target.title);
        // Resolve recording directory based on CWD and config
        const absoluteRecordingDir = path.resolve(process.cwd(), recordingDirectory);
        // Ensure filename uniqueness using the instanceRunId
        const webmFilePath = path.join(absoluteRecordingDir, `${saneTitle}.webm`);

        logger.log(`Recording will be saved to ${webmFilePath}`);
        
        const { stream, fileStream } = await startMediaStreamRecording(page, webmFilePath, logger);
        logger.log(`Recording for ${target.videoLength} minutes...`);

        await playVideo(page, logger); // Press 'k' to play

        await delay(target.videoLength * 60 * 1000); // Wait for the specified video length

        logger.log("Stopping recording stream...");
        await stopMediaStreamRecording(stream, fileStream, logger);
        logger.log(`Recording finished. WebM saved to ${webmFilePath}. ✨`);

    } catch (error) {
        logger.error("An error occurred during the automation process.", error);
        throw error; // Re-throw to allow the main script to catch and log per-target failures
    } finally {
        if (browser) {
            await closeBrowser(browser, logger);
        }
        // Save logs for this specific instance run
        await logger.saveToFile(logDirectory);
    }
}