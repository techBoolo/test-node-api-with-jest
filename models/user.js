import { getDB } from '../config/db.js'

// @return doc / null
const findUser = async (query) => {
  const User = getDB().collection('users')
  return await User.findOne(
    query, 
    { projection: { name: 1, email: 1, contact: 1 }}
  )
}

// @return { insertedId }
const create = async (data) => {
  const User = getDB().collection('users')
  return await User.insertOne(data)
}

export default {
  findUser,
  create,
}
