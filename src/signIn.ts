// src/signIn.ts
import { Page } from "puppeteer-core";
import { PuppeteerExtra } from "puppeteer-extra";
import { Logger } from "./logger";
import { checkEnvVars, delay } from "./utils";
import { launchSigninBrowser } from "./browserManager";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Launches a browser, handles the Google Sign-In process, and returns the signed-in browser instance.
 * @param puppeteerInstance The PuppeteerExtra instance.
 * @param instanceRunId A unique ID for the run.
 * @param logger The Logger instance for logging.
 * @param username The Google username.
 * @param password The Google password.
 * @param continueUrl The URL to redirect to after successful login.
 * @returns A Promise that resolves with the signed-in Browser instance.
 */
async function signInToGoogle(puppeteerInstance: PuppeteerExtra, instanceRunId: string | number, logger: Logger) {
    checkEnvVars();

    if (process.env.googleusername && process.env.googlepassword) {
        logger.log("Launching browser for Google Sign-in...");
        // Assume launchSigninBrowser exists and is similar to launchConfiguredBrowser
        const browser = await launchSigninBrowser(puppeteerInstance, instanceRunId, logger); // <--- Call the new launch function
        const page: Page = await browser.newPage(); // Get a new page from the launched browser

        logger.log("Navigating to Google Sign-in...");
        // It's better to navigate directly to the sign-in page first, then handle continueUrl after login.
        // Google's flow often handles the 'continue' parameter correctly after successful auth.
        const signInUrl = `https://accounts.google.com/v3/signin/identifier?flowName=GlifWebSignIn`;

        // Use the page obtained from the launched browser
        await page.goto(signInUrl, { waitUntil: "networkidle2" });

        logger.log("Entering username...");
        const usernameSelector = "#identifierId";
        await page.waitForSelector(usernameSelector, { visible: true });
        await page.type(usernameSelector, process.env.googleusername);
        await page.click("#identifierNext button");

        logger.log("Waiting for password field...");
        await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {
            logger.warn("No full navigation after username, proceeding to check for password field.");
        });

        logger.log("Entering password...");
        const passwordSelector = 'input[type="password"]';
        await page.waitForSelector(passwordSelector, { visible: true });
        await page.type(passwordSelector, process.env.googlepassword);

        logger.log("Submitting password and waiting for navigation...");
        await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), page.click("#passwordNext button")]);

        logger.log("Login attempt submitted. Should be shown consent if 2FA is enabled.");
        logger.log("Exiting in 30 seconds");

        // Close browser in 30 seconds
        await delay(30000);

        browser.close();
        logger.log("Browser closed.");
    }
}

const stealthPlugin = StealthPlugin();

stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
stealthPlugin.enabledEvasions.delete("media.codecs");

puppeteer.use(stealthPlugin);

signInToGoogle(puppeteer, "System", new Logger("Google Sign In", "System")).then(() => process.exit(0));
