import winston  from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';
const mainFilename = import.meta.url.slice(7);

/**
 * Creating the `logs` directory if not exists
 */
if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const errorLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/error-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'error',
    maxFiles: '7d',
    zippedArchive: true
})

const debugLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/debug-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'debug',
    maxFiles: '7d',
    zippedArchive: true
})

const infoLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/info-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'info',
    maxFiles: '7d',
    zippedArchive: true
})

const warnLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/warn-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'warn',
    maxFiles: '7d',
    zippedArchive: true
})

const sillyLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/silly-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'silly',
    maxFiles: '7d',
    zippedArchive: true
})

const LOG = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.label({ label: path.basename(mainFilename)}),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.printf(
                    log => `${log.timestamp} ${log.level} [${log.label}]: ${log.message}`
                )
            )
        }),
        errorLogFileTransport,
        debugLogFileTransport,
        infoLogFileTransport,
        warnLogFileTransport,
        sillyLogFileTransport
    ]
});

export default LOG;