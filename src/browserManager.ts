import { launch } from "puppeteer-stream";
import { Browser } from "puppeteer-core";
import { PuppeteerExtra } from "puppeteer-extra";
import * as path from "node:path";
import * as fs from 'node:fs/promises';
import { Logger } from "./logger";
import { puppeteerLaunchOptions, userDataDirBase } from "./config";
import { copyDirectory } from "./utils";

export async function launchConfiguredBrowser(
    puppeteer: PuppeteerExtra, // Pass the configured puppeteer instance
    instanceId: string | number,
    logger: Logger
): Promise<Browser> {
    logger.log("Launching browser...");
    // Resolve userDataDir from project root
    const userDataPath = path.resolve(process.cwd(), `${userDataDirBase}${instanceId.toString()}`);

    // Copy user data directory if googleusername is set
    const googleUsername = process.env.googleusername;
    if (googleUsername) {
        const sourceProfileDir = path.resolve(process.cwd(), "UserDataDirs", googleUsername);

        // Check if userDataPath exists and delete it if so, before copying.
        try {
            await fs.access(userDataPath); // Check if directory exists. Throws if not found or not accessible.
            logger.log(`Destination user data directory ${userDataPath} exists. Attempting to delete it...`);
            // Attempt to remove the directory.
            // recursive: true is necessary for directories.
            // force: true means it won't throw an error if the path doesn't exist at the moment of deletion (e.g., a race condition or already gone).
            await fs.rm(userDataPath, { recursive: true, force: true });
            logger.log(`Successfully deleted existing directory ${userDataPath}.`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                // Directory does not exist, which is fine. No deletion needed.
                logger.log(`Destination user data directory ${userDataPath} does not exist. No deletion needed before copy.`);
            } else {
                // Other errors during fs.access or fs.rm (e.g., permissions, or fs.rm failed on an existing dir)
                logger.error(`Error preparing destination directory ${userDataPath} (access/delete): ${error.message}. Proceeding with copy attempt.`);
                // Optionally, re-throw if a clean slate for userDataPath is absolutely critical:
                // throw new Error(`Failed to prepare destination directory ${userDataPath} before copy: ${error.message}`);
            }
        }

        logger.log(`Attempting to copy user data from "${sourceProfileDir}" to "${userDataPath}"...`);
        try {
            await copyDirectory(sourceProfileDir, userDataPath, logger);
            logger.log(`Successfully copied user data from "${sourceProfileDir}" to "${userDataPath}".`);
        } catch (error) {
            logger.error(`Failed to copy user data from "${sourceProfileDir}" to "${userDataPath}". Error: ${error instanceof Error ? error.message : String(error)}`);
            // Depending on requirements, you might want to throw this error
            // or prevent the browser from launching if the profile copy is critical.
        }
    } else {
        logger.error("CRITICAL: `googleusername` environment variable not set. Exiting.")
        process.exit(1);
    }

    const launchOptions: any = {
        ...puppeteerLaunchOptions,
        userDataDir: userDataPath,
    };

    const browser = await launch(puppeteer, launchOptions);
    logger.log(`Browser launched with userDataDir: ${userDataPath}`);
    return browser;
}

export async function launchSigninBrowser(
    puppeteer: PuppeteerExtra,
    instanceId: string | number,
    logger: Logger
): Promise<Browser> {
    logger.log("Launching browser...");
    // Resolve userDataDir from project root
    const googleUsername: string | undefined = process.env.googleusername;
    if (googleUsername) {
        const userDataPath = path.resolve(process.cwd(), "UserDataDirs", googleUsername);

        const launchOptions: any = {
            ...puppeteerLaunchOptions,
            userDataDir: userDataPath,
        };
    
        const browser = await launch(puppeteer, launchOptions);
        logger.log(`Browser launched with userDataDir: ${userDataPath}`);
        return browser;
    } else {
        logger.error("CRITICAL: `googleusername` environment variable not set. Exiting.")
        process.exit(1);
    }
}

export async function closeBrowser(browser: Browser | null, logger: Logger): Promise<void> {
    if (browser) {
        logger.log("Closing browser...");
        try {
            await browser.close();
            logger.log("Browser closed successfully.");
        } catch (error) {
            logger.error("Error closing browser:", error);
            // Depending on desired behavior, you might want to re-throw or handle differently
        }
    }
}
