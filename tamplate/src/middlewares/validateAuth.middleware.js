import { db } from '../database/database.config.js'

export default async function validateAuth(req, res, next) {
  const { authorization } = req.headers
  const token = authorization?.trim().replace('Bearer ', '')

  if (!token) return res.sendStatus(401)

  try {
    const session = await db.collection('sessions').findOne({ token })
    if (!session) return res.sendStatus(401).send('Token invalido')

    res.locals.session = session

    next()
  } catch (err) {
    res.sendStatus(500).send(err.message)
  }
}
