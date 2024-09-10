import joi, { Schema } from 'joi';
import { jwtUserSchema } from '../domains/user/user.schema';

const registerkSchema: Schema = joi.object().keys({
    name: joi.string().required(),
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


export default registerkSchema;
