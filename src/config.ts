export interface Target {
    title: string;
    id: number; // Original ID from the data, can be used for logging or specific logic
    url: string;
    videoLength: number; // in minutes
}

export const targets: Target[] = [
    // {
    //     id: 1,
    //     title: "Geometry Video Lesson 01",
    //     url: "https://drive.google.com/file/d/1yH-Ogdn7j9myZe8DNaLKISCBX3KG8H8A/view",
    //     videoLength: 100,
    // },
    {
        id: 2,
        title: "Geometry Video Lesson 02",
        url: "https://drive.google.com/file/d/10yBJRPtiUK30Qay0dodce1iRgYIxjP_o/view",
        videoLength: 95,
    },
    {
        id: 3,
        title: "Geometry Video Lesson 03",
        url: "https://drive.google.com/file/d/19dCZQC6Y6BWqdV_W6UYU3L8-Z7_kldsS/view",
        videoLength: 106,
    },
    // {
    //     id: 4,
    //     title: "Geometry Video Lesson 04",
    //     url: "https://drive.google.com/file/d/19vALXKqQck3MgSeO8QGdFOJe-4Tyqt7y/view",
    //     videoLength: 96,
    // },
    // {
    //     id: 5,
    //     title: "Geometry Video Lesson 05",
    //     url: "https://drive.google.com/file/d/1AQNjszq-UfzZ7uukgZv-6VSpS98m9bU6/view",
    //     videoLength: 98,
    // },
    // {
    //     id: 6,
    //     title: "Geometry Video Lesson 06",
    //     url: "https://drive.google.com/file/d/1AcZTCcaaQOpRwEc3S7YAWMiUF4hUxYw4/view",
    //     videoLength: 36,
    // },
    // {
    //     id: 7,
    //     title: "Geometry Video Lesson 07",
    //     url: "https://drive.google.com/file/d/1B69QjUqDYc0UwXBEKwcYfzkenz87kEiQ/view",
    //     videoLength: 36,
    // },
    // {
    //     id: 8,
    //     title: "Geometry Video Lesson 08",
    //     url: "https://drive.google.com/file/d/1BOIOvfdJ_R0qonWaA-L5eetIWt4cdGI9/view",
    //     videoLength: 36,
    // },
    // {
    //     id: 9,
    //     title: "Geometry Video Lesson 09",
    //     url: "https://drive.google.com/file/d/1EOhi6FtzXaKaMZof3g2OYJNRlyUMeRms/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 10,
    //     title: "Geometry Video Lesson 10",
    //     url: "https://drive.google.com/file/d/1EbKhx25iV4qpDFzEvxA4GuXrGhk6Irvo/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 11,
    //     title: "Geometry Video Lesson 11",
    //     url: "https://drive.google.com/file/d/1EqSY1aHIspNIDRBbRm3Cc3AuJu1cviTn/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 12,
    //     title: "Geometry Video Lesson 12",
    //     url: "https://drive.google.com/file/d/14gE0-qJTKrObFY7-tE8zjztYohqyj8iB/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 13,
    //     title: "Geometry Video Lesson 13",
    //     url: "https://drive.google.com/file/d/1-G5LsQDxzSvc1WtU2o66QYAp7SGcrtCa/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 14,
    //     title: "Geometry Video Lesson 14",
    //     url: "https://drive.google.com/file/d/10tg_sx8wQYiJZKgI6mJ2iCdHMJg_c_4o/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 15,
    //     title: "Geometry Video Lesson 15",
    //     url: "https://drive.google.com/file/d/12G76YWawgRejH8VMhYxdaA9XC3IBPU8r/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 16,
    //     title: "Geometry Video Lesson 16",
    //     url: "https://drive.google.com/file/d/14sbbxGbGZ_g9zJYsxZS7IjmQbPmM5ssT/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 17,
    //     title: "Geometry Video Lesson 17",
    //     url: "https://drive.google.com/file/d/15PjtVKKBPj0yUP6zwoF2vIYLQdqPE_Os/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 18,
    //     title: "Geometry Video Lesson 18",
    //     url: "https://drive.google.com/file/d/15fJnnEgjRW-LELQky_F0T8yUCsKoBmwK/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 19,
    //     title: "Geometry Video Lesson 19",
    //     url: "https://drive.google.com/file/d/19uG7umpQixC-YjKuVV3PN7BBMgTjKq4V/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 20,
    //     title: "Geometry Video Lesson 20",
    //     url: "https://drive.google.com/file/d/1AhUmO96xv9TFbOVPsfnKQGDzfMoC9nA8/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 21,
    //     title: "Geometry Video Lesson 21",
    //     url: "https://drive.google.com/file/d/1CiMAJgBOIahJud9YTt6G-0d_Pm-AY6-2/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 22,
    //     title: "Geometry Video Lesson 22",
    //     url: "https://drive.google.com/file/d/1FyiTZBDelUDWmeVc8slXDCHMIqFTU22u/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 23,
    //     title: "Geometry Video Lesson 23",
    //     url: "https://drive.google.com/file/d/1IozzcgU24rwZF042Tz34BSURnIYu_hLb/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 24,
    //     title: "Geometry Video Lesson 24",
    //     url: "https://drive.google.com/file/d/1Kw9y6p-Re06BP6MHM-VMrcL1oO6LCgDH/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 25,
    //     title: "Geometry Video Lesson 25",
    //     url: "https://drive.google.com/file/d/1LlRRIPADcvIAYj0cjTXGb6FkUz_hMUFY/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 26,
    //     title: "Geometry Video Lesson 26",
    //     url: "https://drive.google.com/file/d/1PVnWB5p24ie-0ytSd2yFeVUdS95vgxeX/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 27,
    //     title: "Geometry Video Lesson 27",
    //     url: "https://drive.google.com/file/d/1Refb7TaKOyLTttzQZeWVJtCf0GMzm_Mx/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 28,
    //     title: "Geometry Video Lesson 28",
    //     url: "https://drive.google.com/file/d/1SmOPXZQ1QDkYg-tgN1POwUQki17vtes_/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 29,
    //     title: "Geometry Video Lesson 29",
    //     url: "https://drive.google.com/file/d/1XKqqTxTkZfzIvOs3LlTqj_NGkliH-r_0/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 30,
    //     title: "Geometry Video Lesson 30",
    //     url: "https://drive.google.com/file/d/1c_5FHXx6XxC3BkhWKOd5gNGfswKRO9ip/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 31,
    //     title: "Geometry Video Lesson 31",
    //     url: "https://drive.google.com/file/d/1drLIY75MiDmYvfUfKy-kc6oS-tkJmBGt/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 32,
    //     title: "Geometry Video Lesson 32",
    //     url: "https://drive.google.com/file/d/1j7WwZpKVhw-776kjetrUvPHkipWV4mjm/view",
    //     videoLength: 0,
    // },
    // {
    //     id: 33,
    //     title: "Geometry Video Lesson 33",
    //     url: "https://drive.google.com/file/d/1jwQ1rP0FFT9dZADhs1UxPNz_UKVCVe-F/view",
    //     videoLength: 0,
    // },
]

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