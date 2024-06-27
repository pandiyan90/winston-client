import fs from 'node:fs';
import path from 'node:path';
import { configureLogger, getLogger } from '../index.mjs';

const logDir = 'test-logs';

describe('winston-client', () => {
    
    beforeAll(async () => {
        // Clean up the test log directory before running tests
        if (fs.existsSync(logDir)) {
            await fs.promises.rm(logDir, { recursive: true, force: true });
        }
    });

    afterAll(async () => {
        // Clean up the test log directory after running tests
        if (fs.existsSync(logDir)) {
            await fs.promises.rm(logDir, { recursive: true, force: true });
        }
    });

    it('should configure the logger with file and console transports', async () => {
        const userConfig = {
            createFileLogs: true,
            includeConsole: true,
            logDir,
            env: 'dev'
        };

        await configureLogger(userConfig);
        const logger = getLogger();

        expect(logger).toBeDefined();
        expect(logger.transports.length).toBeGreaterThan(0);
    });

    it('should create log files in the specified directory', async () => {
        const userConfig = {
            createFileLogs: true,
            includeConsole: false,
            logDir,
            env: 'dev'
        };

        await configureLogger(userConfig);
        const logger = getLogger();

        // Log some messages
        logger.info('This is an info log message');
        logger.error('This is an error log message');

        // Allow some time for the logs to be written to the filesystem
        await new Promise(resolve => setTimeout(resolve, 1000));

        const logFiles = fs.readdirSync(logDir)
            .filter(file => !file.endsWith('-audit.json')); // Filter out the audit files

        expect(logFiles.length).toBeGreaterThan(0);

        // Check that log files contain the expected messages
        const logFileContents = logFiles.map(file => 
            fs.readFileSync(path.join(logDir, file), 'utf-8')).join('\n');

        expect(logFileContents).toContain('This is an info log message');
        expect(logFileContents).toContain('This is an error log message');
    });
});
