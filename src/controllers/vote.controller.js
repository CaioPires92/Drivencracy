import { db } from '../database/database.config.js'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'

export async function postVote(req, res) {
  const { id } = req.params

  try {
    const choice = await db
      .collection('choices')
      .findOne({ _id: new ObjectId(id) })
    if (!choice) {
      return res.status(404).send('Opção não encontrada.')
    }

    const poll = await db
      .collection('poll')
      .findOne({ _id: new ObjectId(choice.pollId) })
    if (new Date() > new Date(poll.expireAt)) {
      return res.status(403).send('A enquete já expirou.')
    }

    await db
      .collection('choices')
      .updateOne({ _id: new ObjectId(id) }, { $inc: { votes: 1 } })

    const vote = {
      choiceId: id,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm')
    }

    await db.collection('votes').insertOne(vote)

    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
