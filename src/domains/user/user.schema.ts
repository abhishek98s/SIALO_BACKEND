import Joi, { Schema } from 'joi';

export const jwtUserSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    iat: Joi.number(),
    exp: Joi.number(),
})
export const fileSchema: Schema = Joi.object().keys({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png').required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
});