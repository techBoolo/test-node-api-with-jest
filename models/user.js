import { getDB } from '../config/db.js'
import ErrorResponse from '../utils/errorResponse.js'

const findUser = async (query) => {
  const User = getDB().collection('users')

  return await User.findOne(query)
}
// @ use this for data access in the controller, not for data to be sent to the
// user
const fetchUser = async (query) => {
  const User = getDB().collection('users')
  return await User.findOne(query)
}

// @return { insertedId }
const create = async (data) => {
  const User = getDB().collection('users')
  return await User.insertOne(data)
}

const removeUser = async (id) => {
  const User = getDB().collection('users')
  return await User.deleteOne({_id: id})
}


const updateUser = async (user, query) => {
  const User = getDB().collection('users')
 
  return await User.updateOne(
    { _id: user._id }, 
    { 
      ...query,
      $currentDate: { updatedAt: true }
  })
}

export default {
  findUser,
  fetchUser,
  create,
  removeUser,
  updateUser,
}

