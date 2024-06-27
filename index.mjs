import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'node:fs';
import path from 'node:path';

let loggerInstance = null;

const defaultConfig = {
    createFileLogs: true,
    includeConsole: true,
    logDir: 'logs',
    env: process.env.NODE_ENV || 'dev'
};

/**
 * Custom format to include filename and line number
 */
const addFileNameAndLine = winston.format((info) => {
    const stacklist = (new Error()).stack.split('\n').slice(3);
    const stackReg = /\((.*):(\d+):(\d+)\)/;
    const stackReg2 = /at (.*):(\d+):(\d+)/;

    const s = stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 4) {
        info.file = path.basename(sp[1]);
        info.line = sp[2];
    }

    return info;
})();

/**
 * Helper function to create DailyRotateFile transports
 */
const createLogFileTransport = (level, logDir) => new DailyRotateFile({
    filename: path.join(logDir, `${level}-logs-%DATE%.log`),
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    maxFiles: '7d',
    zippedArchive: true,
    level,
    format: winston.format.combine(
        addFileNameAndLine,
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf(log => `${log.timestamp} ${log.level} (${log.file}:${log.line}): ${log.message}`)
    )
});

/**
 * Helper function to create Console transport
 */
const createConsoleTransport = () => new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        addFileNameAndLine,
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf(log => `${log.timestamp} ${log.level} (${log.file}:${log.line}): ${log.message}`)
    ),
});

/**
 * Function to validate configuration
 */
const validateConfig = (config) => {
    if (typeof config.createFileLogs !== 'boolean') {
        throw new Error('Invalid configuration: createFileLogs must be a boolean');
    }
    if (typeof config.includeConsole !== 'boolean') {
        throw new Error('Invalid configuration: includeConsole must be a boolean');
    }
    if (typeof config.logDir !== 'string') {
        throw new Error('Invalid configuration: logDir must be a string');
    }
    if (typeof config.env !== 'string') {
        throw new Error('Invalid configuration: env must be a string');
    }
};

/**
 * Function to configure the logger instance
 */
export const configureLogger = async (userConfig = {}) => {
    if (!loggerInstance) {
        const config = { ...defaultConfig, ...userConfig };
        validateConfig(config);

        if (config.createFileLogs && !fs.existsSync(config.logDir)) {
            fs.mkdirSync(config.logDir, { recursive: true }); // Ensure logDir is created recursively
        }

        const transports = [];

        if (config.includeConsole) {
            transports.push(createConsoleTransport());
        }

        if (config.createFileLogs) {
            ['error', 'debug', 'info', 'warn', 'silly'].forEach(level => {
                transports.push(createLogFileTransport(level, config.logDir));
            });
        }

        loggerInstance = winston.createLogger({
            level: config.env === 'dev' ? 'debug' : 'info',
            format: winston.format.combine(
                addFileNameAndLine,
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                winston.format.json()
            ),
            transports,
        });
    }
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
