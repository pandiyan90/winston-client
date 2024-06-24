import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

let loggerInstance = null;

const defaultConfig = {
    createFileLogs: true,
    includeConsole: true,
    logDir: 'logs',
    env: process.env.NODE_ENV || 'dev',
    mainFilename: import.meta.url.slice(7),
};

/**
 * Helper function to create DailyRotateFile transports
 */
const createLogFileTransport = (level, logDir) => new DailyRotateFile({
    filename: `${logDir}/${level}-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    maxFiles: '7d',
    zippedArchive: true,
    level,
});

/**
 * Function to configure and get the logger instance
 */
export const configureLogger = (userConfig = {}) => {
    if (loggerInstance) {
        throw new Error('Logger is already configured');
    }

    const config = { ...defaultConfig, ...userConfig };

    if (config.createFileLogs && !fs.existsSync(config.logDir)) {
        fs.mkdirSync(config.logDir);
    }

    const transports = [];

    if (config.includeConsole) {
        transports.push(
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(log => `${log.timestamp} ${log.level} [${log.label}]: ${log.message}`)
                ),
            })
        );
    }

    if (config.createFileLogs) {
        transports.push(
            createLogFileTransport('error', config.logDir),
            createLogFileTransport('debug', config.logDir),
            createLogFileTransport('info', config.logDir),
            createLogFileTransport('warn', config.logDir),
            createLogFileTransport('silly', config.logDir)
        );
    }

    loggerInstance = winston.createLogger({
        level: config.env === 'dev' ? 'debug' : 'info',
        format: winston.format.combine(
            winston.format.label({ label: path.basename(config.mainFilename) }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.json()
        ),
        transports,
    });

    return loggerInstance;
};

/**
 * Function to get the logger instance
 */
export const getLogger = () => {
    if (!loggerInstance) {
        throw new Error('Logger is not configured. Call configureLogger() first.');
    }
    return loggerInstance;
};
