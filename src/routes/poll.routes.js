import { Router } from 'express'
import {
  createChoice,
  createPoll,
  getChoice,
  getPoll,
  getResult,
  postVote
} from '../controllers/poll.controllers.js'

const pollRouter = Router()

pollRouter.post('/poll', createPoll)
pollRouter.get('/poll', getPoll)
pollRouter.post('/choice', createChoice)
pollRouter.get('/poll/:id/choice', getChoice)
pollRouter.post('/choice/:id/vote', postVote)
pollRouter.get('/poll/:id/result', getResult)

export default pollRouter
