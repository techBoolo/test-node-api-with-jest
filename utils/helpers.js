import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import envConfig from '../config/envConfig.js'
import User from '../models/user.js'
import ErrorResponse from './errorResponse.js'
import sendEmail from './sendEmail.js'

const frontend_root_url = envConfig.FRONTEND_ROOT_URL

const emailRegex = new RegExp(envConfig.Email_Regexp)

// check only if email matches the specified regexp
const isEmailValid = (email) => {
  return email.match(emailRegex)
}
// is email exists and satisfy the format
const checkEmailValidity = ({ email }) => {
  if(!email || !isEmailValid(email)){
    throw new ErrorResponse({
      statusCode: 400,
      message: 'Please provide valid email'
    })
  }
}

const checkPasswordPolicy = (password) => {
  if(!password || password.length < 3) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'password must exist and its length must be atlease 3 character long'
    })
  }
}

// include password policy validity here
const isPasswordValid = (password) => {
  return password.length >= 3
}

const checkPasswordValidity = ({ password }) => {
  if(!password || !isPasswordValid(password)) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'password required, and must be atleast 3 characters long.'
    })
  }
}

const isEmailAndPasswordValid = ({ email, password }) => {
  checkEmailValidity({ email })
  checkPasswordValidity({ password })
}

const isEmailTaken = async (email) => {
  const user = await User.fetchUser({ email })
  if(user && user.verified.email) {
    throw new ErrorResponse({ 
      statusCode: 409, 
      message: 'Email already exists'
    })
  }
  return user
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

const checkRequestPending = (user) => {
  if(Date.now() < user.passwordResetTokenExpires) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'Please, check your email'
    })
  }
}

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const createHash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const generateToken = () => {
  const token = crypto.randomBytes(20).toString('hex')
  const tokenHash = hashToken(token)
  const tokenExpires = Date.now() + 1000 * 60 * 60 * 12

  return { token, tokenHash, tokenExpires }
}

const sendEmailToUser = async ({ user, subject, message }) => {
  const to = user.email
  const from = envConfig.Email_FROM

  await sendEmail({ to, from, subject, message })
}

const sendEmailVerificationMail = async ({ user, token }) => {
  const subject = 'Verify Email'
  const url = `${frontend_root_url}/users/verifyemail/${token}`
  const message = `
    <h4>Verify your email</h4>
    <p>click the following link to verify your email.</p>
    <a href=${url}>${url}</a>
  `
  await sendEmailToUser({ user, subject, message })
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
  await User.updateUser(user, query)
}

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

const sendPasswordResetEmail = async (user, token) => {
  const url = `${frontend_root_url}/users/resetpassword/${token}`
  const subject = 'Reset password'
  const message = `
    <h4>Reset password</h4>
    <p>follow the following link to reeset your password</p>
    <a href=${url}>${url}</a>
  `

  await sendEmailToUser({user, subject, message })
}

export default {
  checkAccountExists,
  comparePassword,
  generateJWToken,
  isEmailAndPasswordValid,
  isEmailTaken,
  isUserExist,
  hashToken,
  hashPassword,
  generateToken,
  isTokenExpires,
  saveUserToDatabase,
  sendEmailVerificationMail,
  checkSignupExpires,
  checkTokenExpiresAndUpdateVerifyInfo,
  checkRequestPending,
  sendPasswordResetEmail,
  sendEmailToUser,
  checkPasswordPolicy,
  createHash,
}

