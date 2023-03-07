import express from 'express'

const app = express()

app.use('/', (req, res) => {
  res.send('it works\n')
})

export default app
