
# winston-client

`winston-client` is a configurable logging utility built on top of the `winston` library with support for daily rotating log files. This module is designed to be configured once and used throughout your application, providing a consistent and easy-to-use logging setup.

## Installation

Install the package using npm:

```bash
npm install winston-client
```

## Usage

### 1. Configure the Logger

Configure the logger in your main entry file (e.g., `app.js`). This setup ensures that the logger is properly configured before being used in other parts of your application.

```javascript
import { configureLogger } from 'winston-client';

// User configuration
const userConfig = {
    createFileLogs: true,        // Set to false to disable file logging
    includeConsole: true,        // Set to false to disable console logging
    logDir: 'custom-logs',       // Directory for log files
    env: 'production',           // Environment ('development', 'production', etc.)
    mainFilename: import.meta.url.slice(7),  // Main filename for label formatting
};

configureLogger(userConfig);
```

### 2. Use the Logger

In other files, import the `getLogger` function to access the configured logger instance.

```javascript
import { getLogger } from 'winston-client';

const LOG = getLogger();

LOG.info('This is an info log message');
LOG.error('This is an error log message');
LOG.debug('This is a debug log message');
LOG.warn('This is a warning log message');
LOG.silly('This is a silly log message');
```

## Configuration Options

The `configureLogger` function accepts a configuration object with the following options:

- `createFileLogs` (boolean): Whether to create daily rotating log files. Default is `true`.
- `includeConsole` (boolean): Whether to log to the console. Default is `true`.
- `logDir` (string): Directory path for log files. Default is `'logs'`.
- `env` (string): Environment mode. Default is `'development'`.
- `mainFilename` (string): Main filename for labeling logs. Default is derived from `import.meta.url`.

## Example

Here is a complete example demonstrating how to configure and use the logger:

### `app.js`

```javascript
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

// Your application code...
```

### `anotherFile.js`

```javascript
import { getLogger } from 'winston-client';

const LOG = getLogger();

LOG.info('This is an info log message');
LOG.debug('This is a debug log message');
LOG.warn('This is a warning log message');
LOG.error('This is an error log message');
LOG.silly('This is a silly log message');
```

## Error Handling

If you try to get the logger instance before configuring it, an error will be thrown:

```javascript
import { getLogger } from 'winston-client';

const LOG = getLogger(); // Error: Logger is not configured. Call configureLogger() first.
```

Ensure that `configureLogger` is called before attempting to get the logger instance.

## License

This project is licensed under the ISC License.
