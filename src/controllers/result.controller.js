import { db } from '../database/database.config.js'
import { ObjectId } from 'mongodb'

export async function getResult(req, res) {
  const { id } = req.params

  try {
    const poll = await db.collection('poll').findOne({ _id: new ObjectId(id) })
    if (!poll) {
      return res.status(404).send('Enquete não encontrada.')
    }

    const result = await db
      .collection('choices')
      .find({ pollId: new ObjectId(id) })
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
