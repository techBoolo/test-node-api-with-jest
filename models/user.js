import { getDB } from '../config/db.js'

const findUser = async (query) => {
  const User = getDB().collection('users')

  return await User.findOne(query)
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
  updateUser,
}
