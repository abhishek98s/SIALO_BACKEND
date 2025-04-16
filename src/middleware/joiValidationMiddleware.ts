
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Schema } from 'joi';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';

const joiValidationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ status: false, message });
    }
  };
};

export const joiFileValidationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: middlewareExceptionMessage.FILE_REQUIRED });
    }

    const { error } = schema.validate(req.file);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: message });
    }
  };
};

export default joiValidationMiddleware;
