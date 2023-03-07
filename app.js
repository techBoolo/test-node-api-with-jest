import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import routeNotFound from './middlewares/routeNotFound.js'
import logger from './middlewares/logger.js'

const app = express()

app.use(logger)
app.get('/', (req, res) => {
  res.send('it works\n')
})

app.post('/', (req, res) => {
  throw new Error('Test any error thrown will be handled')
})

app.use(routeNotFound)
app.use(errorHandler)
export default app
