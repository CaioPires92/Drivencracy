import { Router } from 'express'

import { createPoll, getPoll } from '../controllers/poll.controllers.js'
import { createChoice, getChoice } from '../controllers/choice.controlle.js'
import { getResult } from '../controllers/result.controller.js'
import { postVote } from '../controllers/vote.controller.js'

const pollRouter = Router()

pollRouter.post('/poll', createPoll)
pollRouter.get('/poll', getPoll)
pollRouter.post('/choice', createChoice)
pollRouter.get('/poll/:id/choice', getChoice)
pollRouter.post('/choice/:id/vote', postVote)
pollRouter.get('/poll/:id/result', getResult)

export default pollRouter
