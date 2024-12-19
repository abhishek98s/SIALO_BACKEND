/** @format */

import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    status: false,
    message: err.message,
  });
};
