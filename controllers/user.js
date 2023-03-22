import User from '../models/user.js'
import helpers from '../utils/helpers.js'
import ErrorResponse from '../utils/errorResponse.js'

const signup = async (req, res) => {
  const { name, email, password } = req.body

  // is the provided email and password correct
  helpers.isEmailAndPasswordValid({ email, password })
  // check if email taken and verified
  const user = await helpers.isEmailTaken(email)

  // check if the user exists and the time is expires or not
  await helpers.checkSignupExpires(email)

  // before saving the user we try to send a verification email, if we are
  // successful, we save the user in our db
  const { token, tokenHash, tokenExpires } =  await helpers.generateToken()
 //  await helpers.sendEmailVerificationMail({user: { email }, token}) 
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
  signup,
  verifyEmail,
  signin,
  forgotPassword,
  resetPassword,
}
