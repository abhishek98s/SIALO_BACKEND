import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        if (!token) throw new Error('Access Denied');

        jwt.verify(token.replace('Bearer ', ''), process.env.JWT_TOKEN as string, (err, decoded) => {
            if (err) {
                console.log(err);
                throw new Error('Unauthorized');
            }

            req.body.user = decoded;
            next();
        });
    } catch (error) {
        res.status(401).json({ msg: (error as Error).message });
    }
};
