import { NextFunction, Request, Response } from 'express';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json(
        {
            status: false,
            message: err.message,
        },
    );
};
