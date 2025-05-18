import { Browser, Page } from "puppeteer";
import { Logger } from "./logger";
import { defaultPageTimeout, videoPlayerSelector as defaultVideoPlayerSelector } from "./config";
import { delay } from "./utils";

export async function setupNewPage(browser: Browser, logger: Logger): Promise<Page> {
    logger.log("Opening new page...");
    const page = await browser.newPage();
    await page.setDefaultTimeout(defaultPageTimeout);
    await page.setDefaultNavigationTimeout(defaultPageTimeout);
    logger.log(`New page opened with default timeout: ${defaultPageTimeout / 1000 / 60} minutes.`);
    return page;
}

export async function navigateToUrl(page: Page, url: string, logger: Logger): Promise<void> {
    logger.log(`Navigating to URL: ${url}...`);
    // Using 'networkidle0' can be more robust for pages with many network requests.
    // 'networkidle2' (at most 2 active connections) is a good compromise.
    await page.goto(url, { waitUntil: 'networkidle2' });
    logger.log("Navigation successful.");
}

export async function prepareVideoPlayer(
    page: Page,
    logger: Logger,
    videoPlayerSelector: string = defaultVideoPlayerSelector // Use default from config if not provided
): Promise<void> {
    logger.log(`Waiting for video player element: ${videoPlayerSelector}...`);
    await page.waitForSelector(videoPlayerSelector, { visible: true });
    await delay(1000); // Short delay for element stabilization after visibility

    logger.log(`Focusing on video player element: ${videoPlayerSelector}...`);
    await page.focus(videoPlayerSelector);

    logger.log("Pressing 'f' to attempt full screen for the video...");
    await page.keyboard.press("f");
    await delay(1000); // Allow time for fullscreen transition
}

export async function playVideo(page: Page, logger: Logger): Promise<void> {
    logger.log("Pressing 'k' to attempt playing the video...");
    await page.keyboard.press("k");
}