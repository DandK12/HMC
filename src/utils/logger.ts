type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private readonly logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private level: LogLevel = 'info';

  constructor() {
    // Set log level based on environment
    if (import.meta.env.DEV) {
      this.level = 'debug';
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    // Add to in-memory logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const consoleMethod = console[level] || console.log;
    consoleMethod(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '');

    // In production, we could send logs to a service
    if (import.meta.env.PROD) {
      this.persistLog(entry);
    }
  }

  private async persistLog(entry: LogEntry) {
    // Here we could implement log persistence
    // For example, sending to a logging service
    try {
      // Example: Send to logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs.length = 0;
  }
}

export const logger = new Logger();