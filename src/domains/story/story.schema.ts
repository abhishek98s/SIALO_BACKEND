import Joi, { Schema } from 'joi';
import { jwtUserSchema } from '../user/user.schema';

export const storyPostSchema: Schema = Joi.object().keys({
    caption: Joi.string().required(),
    user: jwtUserSchema,
});
