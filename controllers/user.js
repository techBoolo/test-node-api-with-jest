import User from '../models/user.js'
import helpers from '../utils/helpers.js'
import ErrorResponse from '../utils/errorResponse.js'

const signup = async (req, res) => {
  const { name, email, password } = req.body

  // is the provided email and password correct
  helpers.isEmailAndPasswordValid({ email, password })
  // check if email taken and verified
  await helpers.isEmailTaken(email)

  // check if the user exists and the time is expires or not
  await helpers.checkSignupExpires(email)

  // before saving the user we try to send a verification email, if we are
  // successful, we save the user in our db
  const { token, tokenHash, tokenExpires } =  await helpers.generateToken()
  await helpers.sendEmailVerificationMail({email, token}) 
  await helpers.saveUserToDatabase({ 
    name, 
    email, 
    password,
    emailVerificationTokenHash: tokenHash,
    emailVerificationTokenExpires: tokenExpires
  })

  res.status(201).json({ message: 'signup success'})
}

const verifyEmail = async (req, res) => {
  const { token } = req.params
  const tokenHash = helpers.hashToken(token)
  const user = await helpers.isUserExist({ emailVerificationTokenHash: tokenHash })
  await helpers.checkTokenExpiresAndUpdateVerifyInfo(user)
  
  res.status(200).json({ message: 'email veified'})
}

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
  signup,
  verifyEmail,
  signin,
}
