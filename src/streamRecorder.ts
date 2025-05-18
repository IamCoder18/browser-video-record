// src/streamRecorder.ts
import { Page } from "puppeteer-core";
import { getStream } from "puppeteer-stream";
import * as fs from "node:fs";
import * as path from "node:path";
import { Logger } from "./logger";
import { streamOptions as defaultStreamOptions } from "./config";

interface RecordingHandles {
    stream: any;
    fileStream: fs.WriteStream;
}

export async function startMediaStreamRecording(
    page: Page,
    outputFilePath: string,
    logger: Logger
): Promise<RecordingHandles> {
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        logger.log(`Created recording directory: ${outputDir}`);
    }

    const fileStream = fs.createWriteStream(outputFilePath);
    logger.log(`Preparing to record. Output file: ${outputFilePath}`);

    const stream = await getStream(page, defaultStreamOptions);
    logger.log("Media stream acquired.");

    stream.pipe(fileStream);
    logger.log("Stream is now piping to file.");

    return { stream, fileStream };
}

export async function stopMediaStreamRecording(
    stream: any,
    fileStream: fs.WriteStream,
    logger: Logger
): Promise<void> {
    logger.log("Attempting to stop recording stream...");

    return new Promise<void>((resolve, reject) => {
        let fileClosedOrErrored = false; // Guard against multiple calls to resolve/reject

        const closeFileAndFinish = (error?: Error) => {
            if (fileClosedOrErrored) return;
            fileClosedOrErrored = true;

            if (!fileStream.destroyed && !fileStream.closed) {
                fileStream.close((closeErr) => {
                    if (closeErr) {
                        logger.error("Error closing file stream:", closeErr);
                        reject(error || closeErr); // Prioritize original stream error or use closeErr
                    } else {
                        logger.log("File stream closed successfully.");
                        if (error) reject(error); else resolve();
                    }
                });
            } else {
                logger.log("File stream was already closed or destroyed prior to explicit close call.");
                if (error) reject(error); else resolve();
            }
        };
        
        // Listeners for stream events
        stream.once("end", () => { logger.log("MediaStream 'end' event received."); closeFileAndFinish(); });
        stream.once("close", () => { logger.log("MediaStream 'close' event received."); closeFileAndFinish(); });
        stream.once("error", (err: Error) => { logger.error("MediaStream error:", err); closeFileAndFinish(err); });

        // Initiate stream destruction
        if (!stream.destroyed) {
            stream.destroy();
            logger.log("MediaStream.destroy() called.");
        } else { // If already destroyed, 'end' or 'close' might not fire, so try closing file.
            logger.log("MediaStream was already destroyed. Ensuring file stream is closed.");
            closeFileAndFinish();
        }
    });
}