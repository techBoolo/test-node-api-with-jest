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

  res.status(200).json({ message: 'signup success'})
}

const verifyEmail = async (req, res) => {
  const { token } = req.params
  const tokenHash = helpers.hashToken(token)
  const user = await helpers.isUserExist({ emailVerificationTokenHash: tokenHash })
  await helpers.checkTokenExpiresAndUpdateVerifyInfo(user)
  
  res.status(200).json({ message: 'email veified'})
}

export default {
  signup,
  verifyEmail,
}
