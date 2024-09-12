import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createError from 'http-errors';
dotenv.config();

import { IJWT, IRegister } from './auth.model';
import { isMatchingPassword, passwordHash } from '../utils/bcrypt';
import * as UserDAO from '../domains/user/user.repository';
import * as AuthDAO from './auth.repository';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';
import { authExceptionMessage } from './constant/authExceptionMessage';
import { authSuccessMessage } from './constant/authSuccessMessages';

export const getTokens = async (email: string, password: string) => {
    const user = await UserDAO.fetchByEmail(email);

    if (!user) throw new createError.NotFound(userExceptionMessage.USER_NOT_FOUND);

    await isMatchingPassword(password, user.password);

    const payload = {
        id: user._id,
        name: user.name,
        image: user.img,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
    });

    return { accessToken, refreshToken };
};


export const registerUser = async (userData: IRegister) => {
    const { name, email, password } = userData;

    const hashedPassword = await passwordHash(password);
    // const img_url = imgPath ? await cloudinary.v2.uploader.upload(imgPath) : null;

    const newUser = {
        name,
        email,
        password: hashedPassword,
        // img: img_url!.secure_url,
    };

    return await UserDAO.create(newUser);
};

export const getRefreshToken = async (refreshToken: string) => {
    let accessToken;
    jwt.verify(refreshToken, (process.env.REFRESH_TOKEN_SECRET as string)!, (err, decoded) => {
        if (err) {
            throw new createError.BadRequest(authExceptionMessage.INVALID_TOKEN);
        }
        const { id, name, image } = decoded as IJWT;

        const newAccessToken = jwt.sign({ id, name, image }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
        });
        accessToken = newAccessToken;
    });

    return accessToken;
};

export const updatePassword = async (currentPassword: string, newPassword: string, user_id: string) => {
    const user = await UserDAO.fetchById(user_id);

    if (!user) throw new createError.NotFound(userExceptionMessage.USER_NOT_FOUND);

    const { password } = user;

    await isMatchingPassword(currentPassword, password);

    if (currentPassword === newPassword) throw new createError.BadRequest(authExceptionMessage.SAME_PASSWORD)

    const hashedPassword = await passwordHash(newPassword);

    const result = await AuthDAO.updatePassword(user_id, hashedPassword);

    const isUpdated = result.modifiedCount;

    if (isUpdated) {
        return authSuccessMessage.PASSWORD_UPDATED;
    } else {
        throw new createError.InternalServerError(authExceptionMessage.PASSWORD_UPDATE);
    }
};
