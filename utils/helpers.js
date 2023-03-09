import bcrypt from 'bcrypt'
import crypto from 'crypto'
import envConfig from '../config/envConfig.js'
import User from '../models/user.js'
import ErrorResponse from './errorResponse.js'
import sendEmail from './sendEmail.js'

const frontend_root_url = envConfig.FRONTEND_ROOT_URL

const isEmailTaken = async (email) => {
  const user = await User.fetchUser({ email })
  if(user && user.verified.email) {
    throw new ErrorResponse({ 
      statusCode: 409, 
      message: 'Email already exists'
    })
  }
}

const checkSignupExpires = async (email) => {
  const user = await User.fetchUser({ email })
  if(user && !isTokenExpires(user.emailVerificationTokenExpires)) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'Previous signup verification is pending, please check you email'
    })
  } else if(user) {
    await User.removeUser(user._id)
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

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
const generateToken = () => {
  const token = crypto.randomBytes(20).toString('hex')
  const tokenHash = hashToken(token)
  const tokenExpires = Date.now() + 1000 * 60 * 60 * 12

  console.log(token);
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

const isUserExist = async (query) => {
  const user = await User.fetchUser(query)
  if(!user) {
    throw new ErrorResponse({
      statusCode: 404,
      message: 'User does not exist'
    })
  } else {
    return user
  }
}

const isTokenExpires = (time) => {
  const now = Date.now()
  return now > time
}

const checkTokenExpiresAndUpdateVerifyInfo = async (user) => {
  if(isTokenExpires(user.emailVerificationTokenExpires)) {
    await User.removeUser(user._id)
    throw new ErrorResponse({ statusCode: 400, message: 'Verification time expires, Please try to signup again.'})
  }
  const query = {
    $set: { 'verified.email': true },
    $unset: { emailVerificationTokenHash: '', emailVerificationTokenExpires: '' }
  }
  await User.updateUser(user._id, query)
}

export default {
  isEmailTaken,
  isUserExist,
  hashToken,
  generateToken,
  isTokenExpires,
  saveUserToDatabase,
  sendEmailVerificationMail,
  checkSignupExpires,
  checkTokenExpiresAndUpdateVerifyInfo,
}
