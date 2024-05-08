import { BadRequestException, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Data validation error';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(errors: ValidationError[], host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;
    const message = INTERNAL_SERVER_ERROR_MESSAGE;

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        errors: errors.reduce((result, error) => {

          return {
            ...result,
            [error.property]: error.constraints
          }
        }, {})
      });
  }
}
