import supertest from 'supertest'
import helpers from '../utils/helpers.js'
import bcrypt  from 'bcrypt'
import app from '../app.js'
import connectDB, { getDB } from '../config/db.js'

const api = supertest(app)
let userData
beforeAll(async () => {
  await connectDB()
})

beforeEach(async () => {
  const User = getDB().collection('users')
  await User.deleteMany()

  const password = await helpers.hashPassword('pass') 
  userData = { email: 'user-test@email.com', password: password, loginAllowed: 'true'  }
  await User.insertOne(userData)
})

describe('signin', () => {
  test('email and password are needed', async () => {
    await api    
      .post('/users/signin')
      .send({})
      .expect(400, { error: { message: 'Please, provide your email and password!'}})
  })
  test('account must exist', async () => {
    await api    
      .post('/users/signin')
      .send({ email: 'nonExisting@emil.com', password: 'pass' })
      .expect(404, { error: { message: 'Account does not exist'}})
  })
  test('password must be correct', async () => {
    await api    
      .post('/users/signin')
      .send({ ...userData, password: 'password' })
      .expect(403, { error: { message: 'Authentication failed'}})
  })
  test('with correct credential user can signin', async () => {
    await api    
      .post('/users/signin')
      .send({ ...userData, password: 'pass'  })
      .expect(200)
  })
})
