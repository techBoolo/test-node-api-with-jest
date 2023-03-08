import bcrypt from 'bcrypt'
import crypto from 'crypto'
import envConfig from '../config/envConfig.js'
import User from '../models/user.js'
import ErrorResponse from './errorResponse.js'
import sendEmail from './sendEmail.js'

const frontend_root_url = envConfig.FRONTEND_ROOT_URL

const isEmailTaken = async (email) => {
  const user = await User.findUser({ email })
  if(user) {
    throw new ErrorResponse({ 
      statusCode: 409, 
      message: 'Email already exists, if that is your email, please try to reset your password'
    })
  }
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, +envConfig.BcryptSaltRounds)
}

const saveUserToDatabase = async ({ password, ...rest }) => {
  const hashedPassword = await hashPassword(password)
  const newUser = {
    ...rest,
    password: hashedPassword,
    role: 'User',
    verified: {
      email: false
    },
    isLoginAllowed: true,
    createdAt: new Date()
  }
  const response = await User.create(newUser)
  return await User.findUser({ _id: response.insertedId })
}

const generateToken = () => {
  const token = crypto.randomBytes(20).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const tokenExpires = Date.now() + 1000 * 60 * 60 * 12

  return { token, tokenHash, tokenExpires }
}

const sendEmailToUse =  async ({ email, subject, message }) => {
  const to = email
  const from = envConfig.EMAIL_FROM

  await sendEmail({ to, from, subject, message })
}

const sendEmailVerificationMail = async ({ email, token }) => {
  const subject = 'Verify Email'
  const url = `${frontend_root_url}/users/verifyemail/${token}`
  const message = `
    <h4>Verify your email</h4>
    <p>click the following link to verify your email.</p>
    <a href=${url}>${url}</a>
  `
  await sendEmailToUse({ email, subject, message })
}


export default {
  isEmailTaken,
  generateToken,
  saveUserToDatabase,
  sendEmailVerificationMail,
}
