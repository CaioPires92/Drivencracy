import Joi from 'joi'

export const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
})

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
})
