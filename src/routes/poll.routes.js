import { Router } from 'express'

import { createPoll, getPoll } from '../controllers/poll.controllers.js'
import { createChoice, getChoice } from '../controllers/choice.controllers.js'
import { getResult } from '../controllers/result.controller.js'
import { postVote } from '../controllers/vote.controller.js'
import { pollSchema } from '../schemas/polls.schema.js'
import { choiceSchema } from '../schemas/choice.schema.js'
import validateSchema from '../middlewares/validateSchema.middleware.js'

const pollRouter = Router()

pollRouter.post('/poll', validateSchema(pollSchema), createPoll)
pollRouter.get('/poll', getPoll)
pollRouter.post('/choice', validateSchema(choiceSchema), createChoice)
pollRouter.get('/poll/:id/choice', getChoice)
pollRouter.post('/choice/:id/vote', postVote)
pollRouter.get('/poll/:id/result', getResult)

export default pollRouter


