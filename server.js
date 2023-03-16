import http from 'http'
import app from './app.js'
import envConfig from './config/envConfig.js'
import connectDB from './config/db.js'

const PORT = envConfig.PORT || 3001

// const server = http.createServer(app)
const server = http.createServer()
server.on('request', app)

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT} in ${envConfig.NODE_ENV} mode`);
    })
  })
  .catch(err => {
    console.log(err);
    process.exit(1)
  })
