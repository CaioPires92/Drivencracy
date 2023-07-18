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

    if (choice.length === 0) {
      return res.sendStatus(404)
    }

    res.send(choice)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function postVote(req, res) {
  const { id } = req.params

  try {
    // Verificar se é uma opção existente
    const choice = await db
      .collection('choices')
      .findOne({ _id: new ObjectId(id) })
    if (!choice) {
      return res.status(404).send('Opção não encontrada.')
    }

    // Verificar se a enquete já expirou
    const poll = await db
      .collection('poll')
      .findOne({ _id: new ObjectId(choice.pollId) })
    if (new Date() > new Date(poll.expireAt)) {
      return res.status(403).send('A enquete já expirou.')
    }

    // Atualizar os votos da opção
    await db
      .collection('choices')
      .updateOne({ _id: new ObjectId(id) }, { $inc: { votes: 1 } })

    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// export async function getResult(req, res) {
//   const { id } = req.params

//   try {
//     // Verificar se a enquete existe
//     const poll = await db.collection('poll').findOne({ _id: new ObjectId(id) })
//     if (!poll) {
//       return res.status(404).send('Enquete não encontrada.')
//     }

//     // Obter a opção de voto mais votada
//     const result = await db
//       .collection('choices')
//       .aggregate([
//         { $match: { pollId: id } },
//         { $sort: { votes: -1 } },
//         { $limit: 1 }
//       ])
//       .toArray()

//     const pollResult = {
//       _id: poll._id,
//       title: poll.title,
//       expireAt: poll.expireAt,
//       result: result[0] || { title: '', votes: 0 }
//     }

//     res.send(pollResult)
//   } catch (err) {
//     res.status(500).send(err.message)
//   }
// }

export async function getResult(req, res) {
  const { id } = req.params

  try {
    // Verificar se a enquete existe
    const poll = await db.collection('poll').findOne({ _id: new ObjectId(id) })
    if (!poll) {
      return res.status(404).send('Enquete não encontrada.')
    }

    // Obter a opção de voto mais votada
    const result = await db
      .collection('choices')
      .find({ pollId: id })
      .project({ _id: 0, title: 1, votes: 1 })
      .sort({ votes: -1 })
      .limit(1)
      .toArray()

    const pollResult = {
      _id: poll._id,
      title: poll.title,
      expireAt: poll.expireAt,
      result: result[0] || { title: '', votes: 0 }
    }

    res.send(pollResult)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
