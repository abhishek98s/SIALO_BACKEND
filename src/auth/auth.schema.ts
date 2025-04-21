import joi, { Schema } from 'joi';
import { jwtUserSchema } from '../domains/user/user.schema';
import { authExceptionMessage } from './constant/authExceptionMessage';

export const registerSchema: Schema = joi.object().keys({
  name: joi.string().required().messages({
    'string.base': authExceptionMessage.NAME_STRING,
    'any.required': authExceptionMessage.NAME_REQUIRED,
    'string.empty': authExceptionMessage.NAME_REQUIRED,
  }),
  email: joi.string().email().required().messages({
    'string.base': authExceptionMessage.EMAIL_STRING,
    'any.required': authExceptionMessage.EMAIL_REQUIRED,
    'string.empty': authExceptionMessage.EMAIL_REQUIRED,
    'string.email': authExceptionMessage.EMAIL_INVALID,
  }),
  password: joi
    .string()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      ),
    )
    .required()
    .messages({
      'string.base': authExceptionMessage.PASSWORD_STRING,
      'any.required': authExceptionMessage.PASSWORD_REQUIRED,
      'string.empty': authExceptionMessage.PASSWORD_REQUIRED,
      'string.pattern.base': authExceptionMessage.INVALID_PASSWORD,
    }),
});

export const loginSchema: Schema = joi.object().keys({
  email: joi.string().required().messages({
    'string.base': authExceptionMessage.EMAIL_STRING,
    'any.required': authExceptionMessage.EMAIL_REQUIRED,
    'string.empty': authExceptionMessage.EMAIL_REQUIRED,
    'string.email': authExceptionMessage.EMAIL_INVALID,
  }),
  password: joi.string().required().messages({
    'string.base': authExceptionMessage.PASSWORD_STRING,
    'any.required': authExceptionMessage.PASSWORD_REQUIRED,
    'string.empty': authExceptionMessage.PASSWORD_REQUIRED,
  }),
});

export const refreshTokenSchema: Schema = joi.object().keys({
  refreshToken: joi.string().required().messages({
    'string.base': authExceptionMessage.REFRESH_TOKEN_STRING,
    'any.required': authExceptionMessage.REFRESH_TOKEN_REQUIRED,
    'string.empty': authExceptionMessage.REFRESH_TOKEN_REQUIRED,
  }),
});

export const changePasswordSchema: Schema = joi.object().keys({
  currentPassword: joi.string().required(),
  newPassword: joi
    .string()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .required()
    .messages({
      'string.base': authExceptionMessage.PASSWORD_STRING,
      'any.required': authExceptionMessage.PASSWORD_REQUIRED,
      'string.empty': authExceptionMessage.PASSWORD_REQUIRED,
      'string.pattern.base': authExceptionMessage.INVALID_PASSWORD,
    }),
  user: jwtUserSchema,
});
