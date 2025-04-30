import Joi, { Schema } from 'joi';
import { jwtUserSchema } from '../user/user.schema';
import { storyExceptionMessage } from './constant/storyExceptionMessage';

export const storyPostSchema: Schema = Joi.object().keys({
  caption: Joi.string().required().messages({
    'any.required': storyExceptionMessage.CAPTION_REQUIRED,
    'string.empty': storyExceptionMessage.CAPTION_REQUIRED,
  }),
  user: jwtUserSchema,
});
