import express from 'express'
import cors from 'cors'
import pollRouter from './routes/poll.routes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(pollRouter)

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
