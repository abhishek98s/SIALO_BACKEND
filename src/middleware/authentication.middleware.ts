import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';

dotenv.config();
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        if (!token) throw new Error(middlewareExceptionMessage.TOKEN_REQUIRED);

        jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                throw new Error(middlewareExceptionMessage.UNAUTHORIZE);
            }

            req.body.user = decoded;
            next();
        });
    } catch (error) {
        res.status(401).json({ msg: (error as Error).message });
    }
};
