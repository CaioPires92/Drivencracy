import dayjs from 'dayjs'
import { db } from '../database/database.config.js'

export async function createPoll(req, res) {
  const { title, expireAt } = req.body

  let expirationDate

  if (!expireAt) {
    expirationDate = dayjs().add(30, 'day')
  } else {
    const providedDate = dayjs(expireAt)

    if (providedDate.isValid()) {
      expirationDate = providedDate
    }
  }

  if (!title) {
    return res.status(422).send('O título não pode ser uma string vazia.')
  }

  const poll = {
    title,
    expireAt: expirationDate.format('YYYY-MM-DD HH:mm')
  }

  try {
    await db.collection('poll').insertOne(poll)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getPoll(req, res) {
  try {
    const polls = await db.collection('poll').find().toArray()
    res.send(polls)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
