export const puppeteerLaunchOptions: any = {
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    // headless: "new", // Valid for modern Puppeteer
    args: [
        "--disable-dev-shm-usage",
        "--start-fullscreen",
        "--no-default-browser-check",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
};

// Base path for user data directories, resolved relative to CWD (current working directory)
export const userDataDirBase = "./UserDataDirs/userData"; 

// Default timeout for page operations (e.g., navigation, waiting for selectors)
export const defaultPageTimeout = 1000 * 60 * 5; // 5 minutes

// Directory for saving recordings, resolved relative to CWD
export const recordingDirectory = "./Recordings";

// Directory for saving log files, resolved relative to CWD
export const logDirectory = "./Logs";

// CSS selector for the video player element
export const videoPlayerSelector = "div#drive-viewer-video-player-object-0";

// Options for the puppeteer-stream getStream call
export const streamOptions = {
    audio: true,
    video: true,
    videoConstraints: { // Example constraints, adjust as needed
        mandatory: {
            // Ensure these are supported by your setup/source
            // Frame rate might be limited by the source or screen capture capabilities
            height: 1080, 
            width: 1920,
            frameRate: 60, 
        },
    },
    // audioConstraints, mimeType, etc. can also be specified here
};