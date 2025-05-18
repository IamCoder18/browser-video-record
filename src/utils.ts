import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Logger } from './logger';

/**
 * Asynchronously copies a directory from a source path to a destination path.
 * It ensures the destination directory exists and overwrites its contents
 * with the contents of the source directory.
 * @param srcPath The path to the source directory.
 * @param destPath The path to the destination directory.
 * @param logger A logger instance for logging messages.
 * @throws Will throw an error if the source directory does not exist or if copying fails.
 */
export async function copyDirectory(srcPath: string, destPath: string, logger: Logger): Promise<void> {
    try {
        await fs.access(srcPath); // Check if source directory exists and is accessible
    } catch (e) {
        logger.error(`Source directory ${srcPath} does not exist or is not accessible.`);
        throw new Error(`Source directory ${srcPath} does not exist or is not accessible.`);
    }

    logger.log(`Ensuring destination directory ${destPath} exists and preparing for copy...`);
    await fs.mkdir(destPath, { recursive: true }); // Ensure destination directory exists
    logger.log(`Copying directory from ${srcPath} to ${destPath}...`);
    await fs.cp(srcPath, destPath, { recursive: true, force: true }); // force: true to overwrite if dest exists
    logger.log(`Directory copied successfully from ${srcPath} to ${destPath}.`);
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sanitizeFileName(name: string): string {
    // Replace spaces with underscores, then remove characters not suitable for filenames
    return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
}

export function checkEnvVars(): void {
    const username = process.env.googleusername;
    const password = process.env.googlepassword;
    if (!username || !password) {
        // Log appropriately or throw, depending on how critical these are
        console.warn("Warning: Google username or password environment variables are not set. Login-dependent features may fail.");
    }
}