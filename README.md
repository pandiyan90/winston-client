# winston-client

`winston-client` is a configurable logging utility built on top of the `winston` library with support for daily rotating log files. This module is designed to be configured once and used throughout your application, providing a consistent and easy-to-use logging setup.

## Installation

Install the package using npm:

npm install winston-client

## Usage

1. Configure the Logger

Configure the logger once in your main entry file (e.g., app.js). This setup ensures that the logger is properly configured before being used in other parts of your application.

import { configureLogger } from 'winston-client';

// User configuration
const userConfig = {
    createFileLogs: true,
    includeConsole: true,
    logDir: 'custom-logs',
    env: 'production',
    mainFilename: import.meta.url.slice(7),
};

configureLogger(userConfig);

2. Use the Logger

In other files, import the getLogger function to access the configured logger instance.

import { getLogger } from 'winston-client';

const LOG = getLogger();

LOG.info('This is an info log message');
LOG.error('This is an error log message');

## Configuration Options

The configureLogger function accepts a configuration object with the following options:

- createFileLogs: (boolean) Whether to create log files. Default is true.
- includeConsole: (boolean) Whether to include console logging. Default is true.
- logDir: (string) The directory where log files will be stored. Default is 'logs'.
- env: (string) The environment (e.g., 'development' or 'production'). Default is process.env.NODE_ENV || 'development'.
- mainFilename: (string) The main filename for label formatting. Default is import.meta.url.slice(7).

## Example

Here is a complete example demonstrating how to configure and use the logger:

## app.js

import { configureLogger } from 'winston-client';

const userConfig = {
    createFileLogs: true,
    includeConsole: true,
    logDir: 'custom-logs',
    env: 'production',
    mainFilename: import.meta.url.slice(7),
};

configureLogger(userConfig);

anotherFile.js

import { getLogger } from 'winston-client';

const LOG = getLogger();

LOG.info('This is an info log message');
LOG.error('This is an error log message');
