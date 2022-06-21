import { NextFunction, Request, Response } from 'express';

export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'something went wrong';
  res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    stack: err.stack,
  });
};
