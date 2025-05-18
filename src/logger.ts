import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as cliProgress from 'cli-progress';

export class Logger {
    private title: string;
    private instanceIdentifierString: string;
    private basePrefix: string;
    private logMessages: string[] = []; // To store log messages for saving to file
    private lastLogWasProgress: boolean = false; // To track if the last log was a progress update
    private progressBar: cliProgress.SingleBar | null = null;

    // ANSI escape codes for colors
    private static readonly RESET = "\x1b[0m";
    private static readonly FG_RED = "\x1b[31m";
    private static readonly FG_YELLOW = "\x1b[33m";
    private static readonly FG_CYAN = "\x1b[36m"; // For prefix
    private static readonly FG_GREEN = "\x1b[32m"; // For log messages

    constructor(title: string, instanceIdentifier: string | number) {
        this.title = title;
        this.instanceIdentifierString = String(instanceIdentifier);
        // Using a more generic "Instance" identifier which could be an index or a specific ID
        this.basePrefix = `${this.title} (Instance: ${this.instanceIdentifierString})`;
    }

    private getTimestamp(): string {
        return new Date().toISOString(); // Consistent timestamp for console and file
    }

    private getConsolePrefix(): string {
        // Timestamp for each log message for better traceability
        // Apply a color to the prefix
        return `${Logger.FG_CYAN}${this.basePrefix} at ${new Date().toLocaleTimeString()}:${Logger.RESET}`; // Keep local time for console readability
    }

    private formatMessageForFile(level: string, message: string, details?: any): string {
        let logEntry = `${this.getTimestamp()} [${level.toUpperCase()}] ${this.basePrefix}: ${message}`;
        if (details) {
            if (details instanceof Error) {
                logEntry += `\nStack Trace: ${details.stack || details.message}`;
            } else {
                try {
                    logEntry += `\nDetails: ${JSON.stringify(details, null, 2)}`;
                } catch (e) {
                    logEntry += `\nDetails: [UnserializableData]`;
                }
            }
        }
        return logEntry;
    }

    private stopActiveProgressBar(): void {
        if (this.progressBar) {
            this.progressBar.stop();
        }
    }

    log(message: string): void {
        this.stopActiveProgressBar();
        console.log(`${this.getConsolePrefix()} ${Logger.FG_GREEN}${message}${Logger.RESET}`);
        this.logMessages.push(this.formatMessageForFile("info", message));
        this.lastLogWasProgress = false;
    }

    warn(message: string, warning?: any): void {
        this.stopActiveProgressBar();
        const prefix = this.getConsolePrefix();
        if (warning) {
            console.warn(`${prefix} ${Logger.FG_YELLOW}${message}${Logger.RESET}`, warning);
        } else {
            console.warn(`${prefix} ${Logger.FG_YELLOW}${message}${Logger.RESET}`);
        }
        this.logMessages.push(this.formatMessageForFile("warn", message, warning));
        this.lastLogWasProgress = false;
    }

    error(message: string, error?: any): void {
        this.stopActiveProgressBar();
        const prefix = this.getConsolePrefix();
        if (error) {
            console.error(`${prefix} ${Logger.FG_RED}${message}${Logger.RESET}`, error);
        } else {
            console.error(`${prefix} ${Logger.FG_RED}${message}${Logger.RESET}`);
        }
        this.logMessages.push(this.formatMessageForFile("error", message, error));
        this.lastLogWasProgress = false;
    }

    /**
     * Logs progress to the console using a progress bar and also logs to the file.
     * @param current The current progress value.
     * @param total The total progress value.
     * @param payload Optional data to display in the progress bar, e.g., { taskStatus: 'Doing something...' }.
     */
    progress(current: number, total: number, payload: Record<string, any> = {}): void {
        const defaultPayload = { taskStatus: 'Processing...' };
        const currentPayload = { ...defaultPayload, ...payload };

        if (!this.lastLogWasProgress || !this.progressBar) {
            // If previous log wasn't progress or no bar exists, create a new one.
            // This also handles the case where a bar might exist but was stopped by a non-progress log.
            if (this.progressBar) { // Ensure any old bar is stopped if it somehow persisted
                this.progressBar.stop();
            }
            
            const formatString = `${Logger.FG_CYAN}${this.basePrefix}${Logger.RESET} [{bar}] {percentage}% | {taskStatus} | ETA: {eta_formatted} ({value}/{total})`;
            this.progressBar = new cliProgress.SingleBar({
                format: formatString,
                hideCursor: true,
                clearOnComplete: false, // Bar remains visible on completion
                stopOnComplete: false,  // We manually stop to ensure it's visible until next log
                // stream: process.stdout, // Default is stderr, which is fine.
            }, cliProgress.Presets.shades_classic);
            this.progressBar.start(total, current, currentPayload);
        } else {
            // Update existing progress bar
            if (this.progressBar.getTotal() !== total) {
                this.progressBar.setTotal(total);
            }
            this.progressBar.update(current, currentPayload);
        }

        const percentage = total > 0 ? Math.round((current / total) * 100) : (current > 0 ? 100 : 0);
        const fileMessage = `Progress: ${currentPayload.taskStatus || ''} ${current}/${total} (${percentage}%)`;
        this.logMessages.push(this.formatMessageForFile("info", fileMessage, payload));
        this.lastLogWasProgress = true;

        if (current >= total && this.progressBar) {
            this.progressBar.stop(); // Stop the bar when progress is complete
        }
    }

    public async saveToFile(logDir: string): Promise<void> {
        if (this.logMessages.length === 0) {
            return; // No messages to save
        }

        const saneTitle = this.title.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
        const saneInstanceId = this.instanceIdentifierString.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `${saneTitle}_Instance-${saneInstanceId}_${timestamp}.log`;
        
        const absoluteLogDir = path.resolve(logDir);
        const filePath = path.join(absoluteLogDir, filename);

        try {
            await fs.mkdir(absoluteLogDir, { recursive: true });
            await fs.writeFile(filePath, this.logMessages.join("\n") + "\n");
            this.log(`Log file saved to ${filePath}`); // Use internal log method
        } catch (err) {
            this.error(`Failed to save log file to ${filePath}`, err); // Use internal error method
        }
    }
}