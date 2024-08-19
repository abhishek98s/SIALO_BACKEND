import Joi, { Schema } from 'joi';

export const postBodySchema: Schema = Joi.object().keys({
    caption: Joi.string().required(),
})