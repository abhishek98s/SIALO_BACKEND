import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';
import asyncWrapper from '../utils/async';

dotenv.config();
export const verifyToken = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        if (!token) throw new Error(middlewareExceptionMessage.TOKEN_REQUIRED);

        jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
            if (err) {
                throw new Error(middlewareExceptionMessage.UNAUTHORIZE);
            }

            req.body.user = decoded;
            next();
        });
    } catch (error) {
        res.status(401).json({ status: false, message: (error as Error).message });
    }
});
