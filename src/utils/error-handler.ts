import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { authExceptionMessage } from '../auth/constant/authExceptionMessage';

export const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  if (parseInt(err.code) === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      status: false,
      message: authExceptionMessage.EMAIL_ALREADY_EXISTS,
    });
  }

  return res.status(statusCode).json({
    status: false,
    message: err.message,
  });
};
