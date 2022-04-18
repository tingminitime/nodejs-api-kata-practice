const getRequestData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = ''
      req.on('data', chunk => body += chunk)
      req.on('end', () => resolve(body))
    } catch (error) {
      reject(error)
    }
  })
}

const findTargetIndex = (data = [], id) => {
  return data.findIndex(item => item.id === id)
}

module.exports = {
  getRequestData,
  findTargetIndex
}