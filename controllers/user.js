import User from '../models/user.js'
import helpers from '../utils/helpers.js'
import ErrorResponse from '../utils/errorResponse.js'

const forgotPassword = async (req, res) => {
  // get the email
  const { email } = req.body
  // find the email in the db
  const user = await User.findUser({ email }) 
  // if user does not exist throw an error
  if(!user) {
    throw new ErrorResponse({
      statusCode: 404,
      message: 'Account not found.'
    })
  }   
  // check if previous request is not expired
  helpers.checkRequestPending(user)

  // generate the reset token and sent the reset link to user
  const { token, tokenHash, tokenExpires } = helpers.generateToken()
  await helpers.sendPasswordResetEmail({ email, token })

  // update the user info on the db
  await User.updateUser(user, { $set: {
    passwordResetTokenHash: tokenHash,
    passwordResetTokenExpires: tokenExpires
  }})

  res.status(200).json({
    message: 'Password reset link sent, Please check your email' 
  })
}

export default {
  forgotPassword
}
