import Joi from 'joi'

export const showSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().uri().required()
})
