import { getDB } from '../config/db.js'

const findUser = async (query) => {
  const User = getDB().collection('users')
  
  return await User.findOne(query)
}

const updateUser = async (query, updateInfo) => {
  const User = getDB().collection('users')
  
  return await User.updateOne(query, updateInfo)
}

export default {
  findUser,
  updateUser
}
