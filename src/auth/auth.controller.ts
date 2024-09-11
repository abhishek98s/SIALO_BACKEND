import { Request, Response } from 'express';
import validator from 'validator';
import createError from 'http-errors';

import * as auth_service from './auth.service';
import asyncWrapper from '../utils/async';
import { authExceptionMessage } from './constant/authExceptionMessage';


export const loginHandler = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) throw new createError.BadRequest(authExceptionMessage.EMAIL_PASSWORD_REQUIRED);

    const tokens = await auth_service.getTokens(email, password);
    const { accessToken, refreshToken } = tokens;

    res.status(200).json({ status: true, data: { accessToken, refreshToken } });
});


export const registerHandler = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !password || !email) throw new createError.BadRequest(authExceptionMessage.EMAIL_PASSWORD_REQUIRED);

    if (!validator.isEmail(email)) throw new createError.BadRequest(authExceptionMessage.EMAIL_INVALID);

    const userData = { name, email, password };

    const savedUser = await auth_service.registerUser(userData);

    res.status(201).json({ status: true, data: savedUser });
});


export const refreshTokenHandler = asyncWrapper(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;

    const newAccessToken = await auth_service.getRefreshToken(refreshToken);

    res.status(201).json({ status: true, data: { accessToken: newAccessToken } });
});

export const changePassword = asyncWrapper(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.body.user;

    const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(newPassword)) {
        throw new Error(authExceptionMessage.INVALID_PASSWORD);
    }

    const message = await auth_service.updatePassword(currentPassword, newPassword, id);

    res.status(201).json({ status: true, data: [], message });
});
