export interface Target {
    title: string;
    id: number;
    url: string;
    videoLength: number; // in minutes
}

export const targets: Target[] = [
    {
        id: 1,
        title: "Video Title",
        url: "https://videourl.com",
        videoLength: 100,
    },
]