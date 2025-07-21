// Simple logger utility
// In production, this should be replaced with a proper logging library like Winston

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    switch (level) {
      case LOG_LEVELS.ERROR:
        if (this.isDevelopment) {
          console.error(logMessage, ...args);
        }
        // In production, send to logging service
        break;
      case LOG_LEVELS.WARN:
        if (this.isDevelopment) {
          console.warn(logMessage, ...args);
        }
        break;
      case LOG_LEVELS.INFO:
        if (this.isDevelopment) {
          console.info(logMessage, ...args);
        }
        break;
      case LOG_LEVELS.DEBUG:
        if (this.isDevelopment) {
          console.log(logMessage, ...args);
        }
        break;
    }
  }

  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }
}

module.exports = new Logger();