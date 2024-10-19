// Winston
import { format, transports, config, createLogger } from "winston";

export const logger = createLogger({
    levels: config.npm.levels,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, meta }) => {
            // Include metadata if it exists
            const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
    ),
    transports: [
        new transports.Console({ level: "info" })
    ]
});