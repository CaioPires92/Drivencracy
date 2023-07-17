import { db } from '../database/database.config.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export async function signUp(req, res) {
  const { name, email, password } = req.body

  try {
    const user = await db.collection('users').findOne({ email })
    if (user) return res.status(409).send('Esse email já foi cadastrado!')

    const hash = bcrypt.hashSync(password, 10)
    await db.collection('users').insertOne({ name, email, password: hash })
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body

  try {
    const user = await db.collection('users').findOne({ email })
    if (!user) return res.status(404).send('usuario não possui cadastro!')

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect) return res.status(401)

    const token = uuid()
    await db.collection('sessions').insertOne({ token, userId: user._id })
    res.send(token)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
export async function signOut(req, res) {
  const token = res.locals.session.token

  try {
    await db.collection('sessions').deleteOne({ token })
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
