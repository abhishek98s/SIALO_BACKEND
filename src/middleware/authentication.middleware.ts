import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';
import asyncWrapper from '../utils/async';
import { customHttpError } from '../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config/config';

export const verifyToken = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'];
      if (!token)
        throw new customHttpError(
          StatusCodes.UNAUTHORIZED,
          middlewareExceptionMessage.TOKEN_REQUIRED,
        );

      jwt.verify(
        token.replace('Bearer ', ''),
        config.jwt.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
          if (err) {
            throw new customHttpError(
              StatusCodes.FORBIDDEN,
              middlewareExceptionMessage.UNAUTHORIZE,
            );
          }

          req.body.user = decoded;
          next();
        },
      );
    } catch (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: false, message: (error as Error).message });
    }
  },
);
