import User from '../models/user.js'
import helpers from '../utils/helpers.js'

const signup = async (req, res) => {
  const { name, email, password } = req.body
  // check if email taken
  await helpers.isEmailTaken(email)
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

export default {
  signup
}
