const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

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

const traceLogFileTransport = new DailyRotateFile({
    filename: `${logDir}/trace-logs-%DATE%.log`,
    frequency: '1h',
    datePattern: 'YYYY-MM-DD_HH',
    maxSize: '10m',
    level: 'trace',
    maxFiles: '7d',
    zippedArchive: true
})

const logger = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.label({ label: path.basename(require.main.filename)}),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.printf(
                    info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
        }),
        errorLogFileTransport,
        debugLogFileTransport,
        infoLogFileTransport,
        warnLogFileTransport,
        traceLogFileTransport
    ]
});

module.exports = logger;