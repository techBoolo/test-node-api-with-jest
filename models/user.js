import { getDB } from '../config/db.js'

const fetchUser = async (query) => {
  const User = getDB().collection('users')

  return await User.findOne(query)
}

export default {
  fetchUser
}
