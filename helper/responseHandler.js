const { HEADERS } = require('../config')

const errorHandler = (res, statusCode, message = 'error') => {
  res.writeHead(statusCode, HEADERS)
  res.write(JSON.stringify({
    success: false,
    message
  }))
  res.end()
}

const successHandler = (res, data = [], message = 'success') => {
  res.writeHead(200, HEADERS)
  res.write(JSON.stringify({
    data,
    success: true,
    message
  }))
  res.end()
}

module.exports = {
  errorHandler,
  successHandler
}