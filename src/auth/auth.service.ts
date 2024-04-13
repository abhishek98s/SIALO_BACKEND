import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { IRegister } from './auth.model';
import cloudinary from '../utils/cloudinary';
import { isMatchingPassword, passwordHash } from '../utils/bcrypt';
import * as UserDAO from '../domains/user/user.repository';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';


export const getToken = async (email: string, password: string) => {
    const user = await UserDAO.fetchByEmail(email);

    if (!user) throw new Error(userExceptionMessage.USER_NOT_FOUND);

    await isMatchingPassword(password, user.password);

    const payload = {
        id: user._id,
        name: user.name,
        image: user.img,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_LIFETIME,
    });

    return token;
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
