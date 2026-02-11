import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { CustomEvent } from './custom.event';
import { Utility } from 'src/common/utility';

@Catch(CustomEvent)
export class CustomEventFilter implements ExceptionFilter {
  catch(exception: CustomEvent, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const log = {
      levelName: 'warn',
      requestId: request.headers['request-id'],
      responseTimeMs:
        Utility.getCurrentTime() - Number(request.headers['start-time']),
      stack: exception.stack,
    };
    if(process.env.SERVICE_LOG_SHOW === 'true') console.log(log);
    const result = Utility.formatResponse(
      { event: exception.message },
      request.headers['request-id'] as string,
    );
    response
      .status(exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(result);
  }
}
