import Joi from 'joi'

export const pollSchema = Joi.object({
  title: Joi.string().required(),
  expireAt: Joi.string().required()
})

// {
// 	_id: ObjectId("54759eb3c090d83494e2d222"),
// 	title: 'Qual a sua linguagem de programação favorita?',
// 	expireAt: "2022-02-28 01:00"
// }
