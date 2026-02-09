import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Utility } from 'src/common/utility';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        const log = {
          timeStamp: Utility.getTimestampString(),
          levelName: 'info',
          type: 'response',
          service: process.env.SERVICE_NAME,
          env: process.env.SERVICE_MODE,
          requestId: request.headers['request-id'],
          statusCode: response.statusCode,
          responseTimeMs:
            Utility.getCurrentTime() - Number(request.headers['start-time']),
        };
        console.log(log);
        const result = Utility.formatResponse(
          data,
          request.headers['request-id'],
        );
        return result;
      }),
    );
  }
}
