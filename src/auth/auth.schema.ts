import joi, { Schema } from 'joi';

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
