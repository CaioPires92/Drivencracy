import { Router } from 'express'
import { signUp, signIn, signOut } from '../controllers/auth.controller.js'
import validateAuth from '../middlewares/validateAuth.middleware.js'

const authRouter = Router()

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', validateAuth, signOut)

export default authRouter
