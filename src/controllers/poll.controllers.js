import dayjs from 'dayjs'
import { db } from '../database/database.config.js'
import { ObjectId } from 'bson'

export async function createPoll(req, res) {
  const { title, expireAt } = req.body

  let expirationDate = dayjs().add(30, 'day')

  if (!title) {
    return res.status(422).send('O título não pode ser uma string vazia.')
  }

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
    const polls = await db.collection('poll').find().toArray()
    res.send(polls)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function createChoice(req, res) {
  const { title, pollId } = req.body

  const choice = {
    title,
    pollId
  }

  const poll = await db
    .collection('poll')
    .findOne({ _id: new ObjectId(pollId) })
  if (!poll) {
    return res.status(404).send('Enquete não encontrada.')
  }

  if (!title) {
    return res.status(422).send('O título não pode ser uma string vazia.')
  }

  const existingChoice = await db
    .collection('choices')
    .findOne({ title, pollId })
  if (existingChoice) {
    return res.status(409).send('O título da opção já está em uso.')
  }

  const expirationDate = dayjs(poll.expireAt)
  if (expirationDate.isBefore(dayjs())) {
    return res.status(403).send('A enquete já expirou.')
  }

  try {
    await db.collection('choices').insertOne(choice)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getChoice(req, res) {
  const { id } = req.params

  console.log(id)

  try {
    const choice = await db
      .collection('choices')
      .find({ pollId: { $eq: id } })
      .toArray()
    res.send(choice)
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
