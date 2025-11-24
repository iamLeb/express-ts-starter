import fs from "fs";
import path from "path";

export class Logger {
  private static logPath = path.join(process.cwd(), "logs", "error.log");

  public static error(message: string) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;

    // Ensure logs directory exists
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Append log entry
    fs.appendFileSync(this.logPath, logMessage, "utf-8");
  }
}
