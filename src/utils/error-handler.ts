import { NextFunction, Request, Response } from 'express';
import { authExceptionMessage } from '../auth/constant/authExceptionMessage';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json(
        {
            msg: authExceptionMessage.INTERNAL_SERVER_ERRROR,
            error: err.message,
        },
    );
};
