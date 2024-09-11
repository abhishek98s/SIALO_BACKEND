import joi, { Schema } from 'joi';
import { jwtUserSchema } from '../domains/user/user.schema';

export const registerSchema: Schema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
})

export const loginSchema: Schema = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required(),
})

export const refreshTokenSchema: Schema = joi.object().keys({
    refreshToken: joi.string().required(),
})

export const changePasswordSchema: Schema = joi.object().keys({
    currentPassword: joi.string().required(),
    newPassword: joi.string().required(),
    user: jwtUserSchema,
})
