import dayjs from 'dayjs'
import { db } from '../database/database.config.js'
import { ObjectId } from 'mongodb'

export async function createShow(req, res) {
  const { name, image } = req.body

  const userId = res.locals.session.userId

  try {
    const show = {
      name,
      image,
      date: dayjs().valueOf(),
      watched: false,
      userId
    }
    await db.collection('shows').insertOne(show)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getShow(req, res) {
  const { filterWatched } = req.query

  const userId = res.locals.session.userId

  let filter = { userId }

  if (filterWatched === 'true' || filterWatched === 'false') {
    filter.watched = { $eq: filterWatched === 'true' }
  }

  try {
    const show = await db.collection('shows').find(filter).toArray()
    res.send(show)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function changeShowStatus(req, res) {
  const { id } = req.params

  const userId = res.locals.session.userId

  try {
    const show = await db
      .collection('shows')
      .findOne({ _id: new ObjectId(id), userId })
    if (!show) return res.sendStatus(404)

    console.log(show)

    await db
      .collection('shows')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { watched: !show.watched } }
      )
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function deleteShow(req, res) {
  const { id } = req.params

  const userId = res.locals.session.userId

  try {
    const show = await db
      .collection('shows')
      .deleteOne({ _id: new ObjectId(id), userId })
    if (show.deletedCount === 0) return res.sendStatus(404)
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function editShow(req, res) {
  const { id } = req.params
  const { name, image } = req.body

  const userId = res.locals.session.userId

  const updateFields = {}
  if (name) {
    updateFields.name = name
  }
  if (image) {
    updateFields.image = image
  }

  try {
    const show = await db
      .collection('shows')
      .updateOne({ _id: new ObjectId(id), userId }, { $set: updateFields })

    if (show.matchedCount === 0) return res.sendStatus(404)
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}
