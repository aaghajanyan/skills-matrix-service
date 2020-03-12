'use strict';
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = '.log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

class LoggerService {
    dailyRotateFileTransport = new transports.DailyRotateFile({
        filename: `${logDir}/%DATE%-results.log`,
        datePattern: 'YYYY-MM-DD'
    });

    logFormat = format.printf(({ level, message, stack, timestamp, label }) => {
        const logStack = stack ? `\n    Handled error stack:${stack}` : '';
        return `${timestamp} ${level} [${label}]: ${message} ${logStack}`;
    });

    consoleLogFormat = format.printf(({ level, message, stack, timestamp, label }) => {
        return `${timestamp} ${level} [${label}]: ${message}`;
    });

    logger = createLogger({
      // change level if in dev environment versus production
      level: env === 'development' ? 'verbose' : 'info',
      format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        this.logFormat
      ),
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.colorize(),
            this.consoleLogFormat
          )
        }),
        this.dailyRotateFileTransport
      ]
    });

    async error(message) {
        this.logger.error('', message);
    }

    async info(message) {
        this.logger.info(message);
    }

    async debug(message) {
        this.logger.debug(message);
    }
}

const logger = new LoggerService();

module.exports = logger;
