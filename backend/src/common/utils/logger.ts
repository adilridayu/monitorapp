/**
 * Custom Logger Utility
 * Provides consistent logging across the application
 */

import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  private static instance: Logger;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string, context?: string) {
    super.log(this.formatMessage(message), context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(this.formatMessage(message), trace, context);
  }

  warn(message: string, context?: string) {
    super.warn(this.formatMessage(message), context);
  }

  debug(message: string, context?: string) {
    super.debug(this.formatMessage(message), context);
  }

  verbose(message: string, context?: string) {
    super.verbose(this.formatMessage(message), context);
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }
}