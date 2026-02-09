import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { CustomError } from './custom.error';
import { Utility } from 'src/common/utility';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const log = {
      levelName: 'error',
      requestId: request.headers['request-id'],
      responseTimeMs:
        Utility.getCurrentTime() - Number(request.headers['start-time']),
      stack: exception.stack,
    };
    console.error(log);
    const result = Utility.formatResponse(
      { error: exception.message },
      request.headers['request-id'] as string,
    );
    response
      .status(exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }
}
