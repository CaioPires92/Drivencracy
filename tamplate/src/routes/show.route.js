import { Router } from 'express'
import {
  changeShowStatus,
  createShow,
  deleteShow,
  editShow,
  getShow
} from '../controllers/show.controllers.js'
import validateSchema from '../middlewares/validadeSchema.middleware.js'
import { showSchema } from '../schema/show.schema.js'
import validateAuth from '../middlewares/validateAuth.middleware.js'

const showRouter = Router()
showRouter.use(validateAuth)

showRouter.post('/show', validateSchema(showSchema), createShow)
showRouter.get('/show', getShow)
showRouter.patch('/show/status/:id', changeShowStatus)
showRouter.delete('/show/:id', deleteShow)
showRouter.put('/show/:id', validateSchema(showSchema), editShow)

export default showRouter
