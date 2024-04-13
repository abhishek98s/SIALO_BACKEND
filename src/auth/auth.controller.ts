import { Request, Response } from 'express';
import validator from 'validator';

import * as auth_service from './auth.service';
import asyncWrapper from '../utils/async';
import { authExceptionMessage } from './constant/authExceptionMessage';


export const loginHandler = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) throw new Error(authExceptionMessage.EMAIL_PASSWORD_REQUIRED);

    const token = await auth_service.getToken(email, password);

    res.status(200).json({ data: { token } });
});


export const registerHandler = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !password || !email) throw new Error(authExceptionMessage.EMAIL_PASSWORD_REQUIRED);

    if (!validator.isEmail(email)) throw new Error(authExceptionMessage.EMAIL_INVALID);

    const userData = { name, email, password };

    const savedUser = await auth_service.registerUser(userData);

    res.status(201).json(savedUser);
});
