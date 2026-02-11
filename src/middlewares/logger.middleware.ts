import { NextFunction, Request, Response } from 'express';
export function Logger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const data = {
    timeStamp: request.headers['start-time'],
    levelName: 'info',
    type: 'request',
    service: process.env.SERVICE_NAME,
    requestId: request.headers['request-id'],
    userId: request.headers['user-id'] || null,
    xForwardedFor: request.headers['x-forwarded-for'] || null,
    ip: request.ip,
    url: request.path,
    method: request.method,
  };
  if(process.env.SERVICE_LOG_SHOW === 'true') console.log(data);
  next();
}
