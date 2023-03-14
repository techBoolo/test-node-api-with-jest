import crypto from 'crypto'
import sendEmail from './sendEmail.js'
import envConfig from '../config/envConfig.js'
import ErrorResponse from './errorResponse.js'
const frontend_root_url = envConfig.FRONTEND_ROOT_URL

const checkRequestPending = (user) => {
  if(Date.now() < user.passwordResetTokenExpires) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'Please, check your email'
    })
  }
}
const createHash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
const generateToken = () => {
  const token = crypto.randomBytes(20).toString('hex')
  const tokenHash = createHash(token)
  const tokenExpires = Date.now() + 1000 * 60 * 60 * 12

  return { token, tokenHash, tokenExpires }
}
const sendEmailToUser = async ({ user, subject, message }) => {
  const to = user.email
  const from = envConfig.Email_FROM

  await sendEmail({ to, from, subject, message })
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
  generateToken,
  checkRequestPending,
  sendPasswordResetEmail,
}
