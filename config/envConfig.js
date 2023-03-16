import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const TEST_DB_NAME = process.env.TEST_DB_NAME

export default {
  PORT,
  NODE_ENV,
  TEST_DB_NAME,
}
