# Browser Video Recorder

Automated video recording from web pages using Puppeteer. This project is designed to record videos, such as online lessons or presentations, directly from a browser environment. It currently supports recording from Google Drive links and utilizes a pre-authenticated Google account session.

## Features

- **Automated Video Recording**: Records specified video targets from URLs.
- **Puppeteer-Powered**: Uses Puppeteer for browser automation and `puppeteer-stream` for capturing media.
- **Stealth Mode**: Incorporates `puppeteer-extra-plugin-stealth` to help avoid bot detection.
- **Google Sign-In Support**: Includes a utility to perform Google Sign-In and save the session to a user profile directory. This profile is then used for recording sessions.
- **Configurable Targets**: Define video targets (URL, title, length) in `src/config.ts`.
- **Individual User Data Directories**: Each recording instance uses a copy of a base authenticated profile, ensuring isolation.
- **Customizable Recording Options**: Video resolution, frame rate, and other stream options can be configured.
- **Detailed Logging**: Comprehensive logging for both the main script and individual recording instances, saved to files.
- **Progress Bar**: CLI progress bar for monitoring recording tasks.

## Prerequisites

- **Node.js**: Version 16.x or higher recommended.
- **npm** or **yarn**: Package manager for Node.js.
- **Google Chrome**: A recent version of Google Chrome browser installed. The path to `chrome.exe` needs to be correctly set in `src/config.ts`.

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd BrowserVideoRecord
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the project directory (e.g., `d:\BrowserVideoRecord\.env`) and add your Google credentials. This is necessary for the Google Sign-In process.
    ```env
    googleusername=your_google_email@gmail.com
    googlepassword=your_google_password
    ```
    **Security Note**: Be cautious with storing passwords in plain text. Consider using more secure methods for production or sensitive environments.

4.  **Configure Chrome Path (if necessary):**
    Open `src/config.ts` and ensure `puppeteerLaunchOptions.executablePath` points to your Google Chrome installation.
    ```typescript
    // src/config.ts
    export const puppeteerLaunchOptions: any = {
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", // Or your actual path
        // ... other options
    };
    ```

5.  **Perform Google Sign-In (One-time setup or when session expires):**
    This step will launch a browser, log you into Google, and save the authenticated user profile. This profile will then be used by the recording script.

    Run the sign-in script:
    ```bash
    npx ts-node src/signIn.ts
    ```
    -   Follow any on-screen prompts in the browser window that opens (e.g., 2FA).
    -   The script will wait for 30 seconds after attempting login and then close the browser.
    -   A user profile directory will be created/updated at `UserDataDirs/<your_google_username>`.

    **Note**: If you have 2-Factor Authentication (2FA) enabled, you will need to complete the 2FA step in the browser window that Puppeteer opens during this `signIn.ts` script execution. The script provides a 30-second window for this.

## Configuration

Most configurations are managed in `src/config.ts`:

-   **`targets`**: An array of `Target` objects, each specifying:
    -   `id`: A unique identifier.
    -   `title`: Title of the video (used for filename and logging).
    -   `url`: The URL of the video to record.
    -   `videoLength`: Desired recording length in minutes.
-   **`puppeteerLaunchOptions`**: Options for launching Puppeteer (e.g., headless mode, args).
-   **`userDataDirBase`**: Base path for storing user data directories. The sign-in script saves the profile to `UserDataDirs/<googleusername>`, and the recording script copies this to `UserDataDirs/userData<instanceRunId>`.
-   **`defaultPageTimeout`**: Default timeout for Puppeteer page operations.
-   **`recordingDirectory`**: Directory where recorded `.webm` files will be saved.
-   **`logDirectory`**: Directory where log files will be saved.
-   **`videoPlayerSelector`**: CSS selector for the video player element (currently configured for Google Drive).
-   **`streamOptions`**: Options for `puppeteer-stream` (audio, video, resolution, frame rate).

## Running the Application

1.  **Install dependencies:** Run `npm install`.
2.  **Configure Google credentials:** Add your `googleusername` and `googlepassword` to a `.env` file in the project root.
3.  **Sign in:** Execute `npm run signin`. Complete any 2-Factor Authentication prompts if necessary.
4.  **Login data saved:** The browser will automatically close after successfully saving your login session.
5.  **Define videos to record:** List the videos you want to record in the `/src/config.ts` file.
6.  **Start recording:** Run `npm run dev`.

## Project Structure

```
BrowserVideoRecord/
├── UserDataDirs/         # Stores browser profiles (e.g., UserDataDirs/your_google_username, UserDataDirs/userData0)
├── Recordings/           # Output directory for recorded videos
├── Logs/                 # Output directory for log files
├── node_modules/         # Project dependencies
├── src/
│   ├── index.ts          # Main script to orchestrate recordings
│   ├── signIn.ts         # Handles Google Sign-In and profile creation
│   ├── recordVideo.ts    # Core logic for recording a single video
│   ├── browserManager.ts # Manages Puppeteer browser instances and profiles
│   ├── pageUtils.ts      # Utility functions for Puppeteer page interactions
│   ├── streamRecorder.ts # Handles media stream recording using puppeteer-stream
│   ├── logger.ts         # Custom logger class
│   ├── config.ts         # Configuration for targets, paths, and Puppeteer options
│   └── utils.ts          # General utility functions (delay, sanitizeFileName, etc.)
├── .env                  # Environment variables (GITIGNORED)
├── package.json
├── tsconfig.json
└── README.md
```

## Logging

-   **Console Output**: Provides real-time feedback with timestamps and color-coded messages.
-   **File Logs**:
    -   A main log file is generated for the `index.ts` script (e.g., `MainScript_System_<timestamp>.log`).
    -   Each recording instance generates its own log file (e.g., `<TargetTitle>_Instance-<RunIndex>_<timestamp>.log`).
    -   Logs are saved in the directory specified by `logDirectory` in `src/config.ts` (default: `./Logs`).

## Troubleshooting & Notes

-   **Google Sign-In Issues**:
    -   Ensure your credentials in `.env` are correct.
    -   If 2FA is enabled, you must complete it in the browser window opened by `signIn.ts`.
    -   Google might occasionally present CAPTCHAs or other security challenges. The script may not handle all of these automatically. You might need to manually intervene during the `signIn.ts` process if it gets stuck.
-   **Video Player Selector**: The `videoPlayerSelector` in `src/config.ts` is specific to Google Drive's video player. If you intend to record from other websites, you will need to update this selector to match the video player element on those sites.
-   **Permissions**: Ensure the application has write permissions for the `UserDataDirs`, `Recordings`, and `Logs` directories.
-   **Chrome Path**: Double-check the `executablePath` in `src/config.ts` if the browser fails to launch.
-   **Headless Mode**: By default, Puppeteer might run in headless mode depending on the `puppeteerLaunchOptions`. For debugging or the initial sign-in, you might want to set `headless: false` (or remove the `headless: "new"` line) in `src/config.ts` to see what the browser is doing. The current configuration in `config.ts` has `headless: "new"` commented out, and `args: ["--start-fullscreen"]` which implies a headed browser.
-   **Resource Usage**: Running multiple Puppeteer instances can be resource-intensive.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs, feature requests, or improvements.