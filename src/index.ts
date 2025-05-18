import puppeteer from "puppeteer-extra";

// Import StealthPlugin
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { recordVideo } from "./recordVideo";
import { logDirectory } from "./config"
import { targets } from "./targets";
import { Logger } from "./logger";


// Instantiate the plugin
const stealthPlugin = StealthPlugin();

stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
stealthPlugin.enabledEvasions.delete("media.codecs");

// Use the plugin
puppeteer.use(stealthPlugin);

// Main execution function
async function main() {
    const mainLogger = new Logger("MainScript", "System");

    process.on('beforeExit', async (code) => {
        // This event is emitted when Node.js empties its event loop and has no additional work to schedule.
        // Normally, the Node.js process will exit when there is no work scheduled,
        // but a listener registered on 'beforeExit' can make asynchronous calls,
        // and thereby cause the Node.js process to continue.
        mainLogger.log(`Script is about to exit with code: ${code}. Saving main logs.`);
        await mainLogger.saveToFile(logDirectory);
    });

    mainLogger.log("Script starting.");

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        // Use loop index for a unique run identifier for userDataDir and filenames
        const instanceRunId = i; 

        mainLogger.log(`Automation for ${target.title} (TargetID: ${target.id}, RunIndex: ${instanceRunId}) will start in ${i * 5} seconds.`);
        
        // Using a self-invoking async function for setTimeout to handle await
        setTimeout(async () => {
            try {
                mainLogger.log(`Starting automation for ${target.title} (TargetID: ${target.id}, RunIndex: ${instanceRunId}).`);
                // Pass the configured puppeteer instance and the target object
                await recordVideo(puppeteer, target, instanceRunId); 
                mainLogger.log(`Automation for ${target.title} (TargetID: ${target.id}, RunIndex: ${instanceRunId}) finished successfully.`);
            } catch (error) {
                mainLogger.error(`Failed to run automation for ${target.title} (TargetID: ${target.id}, RunIndex: ${instanceRunId}).`, error);
            }
        }, i * 5 * 1000); // 5 seconds delay between starting each task
    }
    mainLogger.log("All target automations have been scheduled.");
}

// Run the main function
main().catch(async error => { // Made catch async
    const mainErrorLogger = new Logger("MainScript-Crash", "System");
    mainErrorLogger.error("Unhandled error in main execution:", error);
    await mainErrorLogger.saveToFile(logDirectory); // Save crash-specific logs
    process.exit(1);
});
