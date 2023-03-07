import ErrorResponse from '../utils/errorResponse.js'
export default (req, res, next) => {
  const error = new ErrorResponse({
    statusMessage: 'Route not found',
    statusCode: 404,
    message: 'Route not found.'
  }) 
  next(error)
}
