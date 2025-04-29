import Joi, { Schema } from 'joi';
import { userExceptionMessage } from './constant/userExceptionMessage';
import { utilsExceptionMessages } from '../../utils/constants/utilsExceptionMessages';

export const jwtUserSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  image: Joi.string(),
  iat: Joi.number(),
  exp: Joi.number(),
});

export const fileSchema: Schema = Joi.object().keys({
  fieldname: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  originalname: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  encoding: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  mimetype: Joi.string()
    .valid('image/jpeg', 'image/jpg', 'image/png')
    .required()
    .messages({
      'any.required': userExceptionMessage.FILE_REQUIRED,
      'any.only': utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
    }),
  destination: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  filename: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  path: Joi.string().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
  size: Joi.number().required().messages({
    'any.required': userExceptionMessage.FILE_REQUIRED,
  }),
});

export const changeUsernameSchema = Joi.object().keys({
  username: Joi.string().min(3).required().messages({
    'string.min': userExceptionMessage.USERNAME_LENGTH,
    'any.required': userExceptionMessage.USERNAME_REQUIRED,
  }),
  user: jwtUserSchema,
});
