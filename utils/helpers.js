import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import envConfig from '../config/envConfig.js'
import User from '../models/user.js'
import ErrorResponse from './errorResponse.js'

const isAccountExists = async (query) => {
  const user = await User.fetchUser(query)
  if(user) {
    return user
  } else { 
    return false
  }
}

const checkAccountExists = async (query) => {
  const account = await isAccountExists(query)
  if( !account) {
    throw new ErrorResponse({ 
      statusCode: 404,
      message: 'Account does not exist'
    })
  }
  return account
}

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash)
  if(!result) {
    throw new ErrorResponse({
      statusCode: 403,
      message: 'Authentication failed'
    })
  }
}

const generateJWToken = async (payload) => {
  return await jwt.sign(
    payload, 
    envConfig.JWT_KEY, 
    {
      expiresIn: '180d'
    }
  ) 
}

export default {
  checkAccountExists,
  comparePassword,
  generateJWToken,
}
