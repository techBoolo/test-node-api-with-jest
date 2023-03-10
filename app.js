import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import routeNotFound from './middlewares/routeNotFound.js'
import logger from './middlewares/logger.js'
import userRoute from './routes/user.js'

const app = express()

app.use(logger)
app.get('/', (req, res) => {
  res.send('it works\n')
})

app.use('/users', userRoute)

app.use(routeNotFound)
app.use(errorHandler)
export default app
