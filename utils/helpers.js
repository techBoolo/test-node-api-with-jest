import crypto from 'crypto'
import bcrypt from 'bcrypt'
import ErrorResponse from './errorResponse.js'
import envConfig from '../config/db.js'

const generateToken = () => {
  return crypto.randomBytes(20).toString('hex')
}
const createHash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const checkPasswordPolicy = (password) => {
  if(!password || password.length < 3) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'password must exist and its length must be atlease 3 character long'
    })
  }
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, +envConfig.BcryptSaltRounds)
}

export default {
  createHash,
  generateToken,
  checkPasswordPolicy,
  hashPassword,
}
