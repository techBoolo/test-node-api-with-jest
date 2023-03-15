import User from '../models/user.js'
import helpers from '../utils/helpers.js'
import ErrorResponse from '../utils/errorResponse.js'

const resetPassword = async (req, res) => {
  // testing 
//  const t = helpers.generateToken()
//  console.log(t);
//  
//  const hash = helpers.createHash(t)
//  console.log(hash);
  const { token } = req.params
  const { password } = req.body

  const tokenHash = helpers.createHash(token)

  const user = await User.findUser({ passwordResetTokenHash: tokenHash })
  if(!user) {
    throw new ErrorResponse({
      statusCode: 400,
      message: 'The token does not exist, please make another password reset request'
    })
  } else if( user && (Date.now() > user.passwordResetTokenExpires)) {
    // if token exists and expires remove it and throw an error
    await User.updateUser({_id: user._id}, {
      $unset: { passwordResetTokenHash: '', passwordResetTokenExpires: ''}
    })
    throw new ErrorResponse({
      statusCode: 400,
      message: 'The token has expired, please make another password reset request'
    })
  }
  // check password, hash it and save to the db, in addition remove the reset
  // token 
  helpers.checkPasswordPolicy(password)
  const hashedPassword = await helpers.hashPassword(password)

  await User.updateUser({ _id: user._id }, { 
    $set: { password: hashedPassword }, 
    $unset: { passwordResetTokenHash: '', passwordResetTokenExpires: ''}
  })

  res.status(200).json({ message: 'password has changed' })
}

export default {
  resetPassword
}
