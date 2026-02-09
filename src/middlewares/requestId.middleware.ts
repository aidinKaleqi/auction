import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';
import { Utility } from 'src/common/utility';
export function requestId(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  request.headers['start-time'] = Utility.getTimestampString();
  request.headers['request-id'] = request.headers['request-id'] || v4();
  next();
}
