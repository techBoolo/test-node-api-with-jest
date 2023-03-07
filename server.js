import http from 'http'

const PORT = process.env.PORT || 3001
const server = http.createServer()

server.on('request', (req, res) => {
  res.end('it works')
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})
