import joi, { Schema } from 'joi';

const registerkSchema: Schema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
})

export default registerkSchema;
