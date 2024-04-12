import { Request, Response } from 'express';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response) => {
    return res.status(500).json(
        {
            msg: 'Something went wrong, try again later',
            error: err.message,
        },
    );
};
