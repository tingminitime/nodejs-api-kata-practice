const isRouteError = (req, defaultPath) => {
  let result = true
  if (req.url.startsWith(defaultPath)) {
    switch (req.method) {
      case 'POST':
      case 'OPTIONS':
        if (req.url === defaultPath) result = false
        break

      case 'GET':
      case 'DELETE':
      case 'PATCH':
        result = false
        break

      default:
        break
    }
  }

  return result
}

module.exports = isRouteError