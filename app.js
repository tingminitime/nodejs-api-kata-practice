const http = require('http')
const PORT = process.env.PORT || '8080'
const todoRouter = require('./router')

const server = http.createServer(todoRouter)
server.listen(PORT, console.log(`Server is running at PORT ${PORT} ...`))