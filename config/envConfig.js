import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME
const TEST_DB_NAME = process.env.TEST_DB_NAME

export default {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  DB_NAME,
  TEST_DB_NAME,
}
