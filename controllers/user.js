import ErrorResponse from '../utils/errorResponse.js'
import helpers from '../utils/helpers.js'

const signin = async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
    throw new ErrorResponse({ 
      statusCode: 400, 
      message: 'Please, provide your email and password!' 
    })
  }

  const user = await helpers.checkAccountExists({ email })
  await helpers.comparePassword(password, user.password)

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }
  const token = await helpers.generateJWToken(payload)
  res.status(200).json({
    ...payload,
    token,
    message: 'Sigin success'
  })
}

export default {
  signin,
}
