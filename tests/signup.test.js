import supertest from 'supertest'
import app from '../app.js'
import connectDB, { getDB } from '../config/db.js'

const api = supertest(app)

beforeAll(async () => {
  await connectDB()
})
beforeEach(async () => {
  const User = getDB().collection('users')
  await User.deleteMany()
})

describe('signup', () => {

  test('user can not signup without providing email and password', async () => {
    await api
      .post('/users')
      .send()
      .expect(400, { error:{ message: "Please provide valid email"}})
  })

  test('password must exist and should be atleast 3 character long', async () => {
    let userData = { email: 'user@email.com' }
    await api
      .post('/users')
      .send(userData)
      .expect(400, { error:{ message: 'password required, and must be atleast 3 characters long.'}})
      .send({ ...userData, password: 'pa'})
      .expect(400, { error:{ message: 'password required, and must be atleast 3 characters long.'}})
  })

  test ('can not signup with existing account', async () => {
    const userData = { email: 'user9@email.com', password: 'pass' }
    await api
      .post('/users')
      .send(userData)
    await api
      .post('/users')
      .send(userData)
      .expect(400)
  })

  test('with correct data user can signup', async () => {
    const userData = { email: 'user9@email.com', password: 'pass' }
    await api
      .post('/users')
      .send(userData)
      .expect(201, { message: 'signup success' })
  }, 50000)
})
