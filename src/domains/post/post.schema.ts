import Joi, { Schema } from 'joi';
import { jwtUserSchema } from '../user/user.schema';
import { postExceptionMessage } from './constant/postExceptionMessage';

export const postBodySchema: Schema = Joi.object().keys({
  caption: Joi.string().required().messages({
    'any.required': postExceptionMessage.CAPTION_REQUIRED,
    'string.empty': postExceptionMessage.CAPTION_REQUIRED,
  }),
});

export const commentBodySchema: Schema = Joi.object().keys({
  comment: Joi.string().required().messages({
    'any.required': postExceptionMessage.COMMENT_REQUIRED,
    'string.empty': postExceptionMessage.COMMENT_REQUIRED,
  }),
  user: jwtUserSchema,
});
