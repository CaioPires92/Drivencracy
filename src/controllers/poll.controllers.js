import dayjs from 'dayjs'
import { db } from '../database/database.config.js'

export async function createPoll(req, res) {
  const { title, expireAt } = req.body

  let expirationDate = dayjs().add(30, 'day')

  if (expireAt) {
    const providedDate = dayjs(expireAt)

    if (providedDate.isValid() && providedDate.isAfter(dayjs())) {
      expirationDate = providedDate
    }
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
    //
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function createChoice(req, res) {
  try {
    //
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getChoice(req, res) {
  try {
    //
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function postVote(req, res) {
  try {
    //
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getResult(req, res) {
  try {
    //
  } catch (err) {
    res.status(500).send(err.message)
  }
}
