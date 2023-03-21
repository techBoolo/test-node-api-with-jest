import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME
const TEST_DB_NAME = process.env.TEST_DB_NAME
const BcryptSaltRounds = process.env.BcryptSaltRounds
const EMAIL_FROM = process.env.EMAIL_FROM
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FRONTEND_ROOT_URL = process.env.FRONTEND_ROOT_URL
const Email_Regexp = process.env.Email_Regexp
const JWT_KEY = process.env.JWT_KEY

export default {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  DB_NAME,
  TEST_DB_NAME,
  BcryptSaltRounds,
  EMAIL_FROM,
  SENDGRID_API_KEY,
  FRONTEND_ROOT_URL,
  Email_Regexp,
  JWT_KEY,
}
