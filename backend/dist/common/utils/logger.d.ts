import { ConsoleLogger } from '@nestjs/common';
export declare class Logger extends ConsoleLogger {
    private static instance;
    static getInstance(): Logger;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    private formatMessage;
}
