import fs from 'fs';
import { configureLogger, getLogger } from '../index.mjs';

const logDir = 'test-logs';

describe('winston-client', () => {
    beforeAll(async () => {
        // Clean up the test log directory before running tests
        if (fs.existsSync(logDir)) {
            await fs.rm(logDir, { recursive: true, force: true });
        }
    });

    afterAll(async () => {
        // Clean up the test log directory after running tests
        if (fs.existsSync(logDir)) {
            await fs.rm(logDir, { recursive: true, force: true });
        }
    });

    it('should configure the logger with file and console transports', () => {
        const userConfig = {
            createFileLogs: true,
            includeConsole: true,
            logDir,
            env: 'dev',
            mainFilename: 'test-file.js',
        };

        configureLogger(userConfig);
        const logger = getLogger();

        expect(logger).toBeDefined();
        expect(logger.transports.length).toBeGreaterThan(0);
    });

    it('should create log files in the specified directory', () => {
        const userConfig = {
            createFileLogs: true,
            includeConsole: false,
            logDir,
            env: 'dev',
            mainFilename: 'test-file.js',
        };

        configureLogger(userConfig);
        const logger = getLogger();

        logger.info('This is an info log message');
        logger.error('This is an error log message');

        const logFiles = fs.readdirSync(logDir);
        expect(logFiles.length).toBeGreaterThan(0);
    });
});
