class ErrorResponse extends Error{
  constructor(params) {
    super()
    Object.assign(this, {...params, name: this.constructor.name})
  }
}

export default ErrorResponse
