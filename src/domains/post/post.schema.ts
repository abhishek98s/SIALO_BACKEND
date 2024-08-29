import Joi, { Schema } from 'joi';
import { jwtUserSchema } from '../user/user.schema';

export const postBodySchema: Schema = Joi.object().keys({
    caption: Joi.string().required(),
})

export const commentBodySchema: Schema = Joi.object().keys({
    comment: Joi.string().required(),
    user: jwtUserSchema,
})
