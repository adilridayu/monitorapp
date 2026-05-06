/**
 * All Exceptions Filter
 * Global exception handler for consistent error responses
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
  details?: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.extractMessage(message),
      error: this.extractError(message),
    };

    // Add details for validation errors
    if (status === HttpStatus.BAD_REQUEST && typeof message === 'object') {
      errorResponse.details = message;
    }

    // Log error
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }

  private extractMessage(message: any): string | string[] {
    if (typeof message === 'string') {
      return message;
    }

    if (typeof message === 'object' && message.message) {
      return message.message;
    }

    return 'An unexpected error occurred';
  }

  private extractError(message: any): string {
    if (typeof message === 'object' && message.error) {
      return message.error;
    }

    return 'Internal Server Error';
  }
}