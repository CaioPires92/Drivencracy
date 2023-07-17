import { Router } from 'express'
import authRouter from './auth.route.js'
import showRouter from './show.route.js'

const router = Router()

router.use(authRouter)
router.use(showRouter)

export default router
