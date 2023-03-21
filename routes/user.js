import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/')
  .post(userController.signup)

router.route('/verifyemail/:token')
  .put(userController.verifyEmail)

router.route('/signin')
  .post(userController.signin)

export default router
