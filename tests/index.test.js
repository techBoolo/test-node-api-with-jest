import supertest from 'supertest'
import app from '../app.js'

const api = supertest(app)

describe('app basic initial tests', () => {
  test('expect root route to response with 200', async () => {
    await api
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
  })

  test('none existing route should return 404', async () => {
    await api
      .get('/non-existing-route')
      .expect(404, { error: { message: 'Route not found.' }})
      .expect('Content-Type', /application\/json/)
  })

})
