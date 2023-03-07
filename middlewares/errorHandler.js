export default (error, req, res, next) => {
  res.status(error.statusCode || 500)
  res.statusMessage = error.statusMessage
  res.json({
    error: {
      message: error.message
    }
 })
}
