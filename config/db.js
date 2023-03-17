import envConfig from './envConfig.js'
import { MongoClient } from 'mongodb'

let db
const mongodbUrl = envConfig.MONGODB_URI
const dbName = envConfig.NODE_ENV == 'test' 
  ? envConfig.TEST_DB_NAME 
  : envConfig.DB_NAME

const mongoClient = new MongoClient(mongodbUrl)

const connectDB = async () => {
  if(db) return
  process.on('exit', async () => {
    if(mongoClient.topology.isConnected()) {
      await mongoClient.close()
    }
  })
  try {
    await mongoClient.connect()
    console.log('connected to db');
    db = mongoClient.db(dbName)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

export const getDB = () => {
  return db
}

export default connectDB
