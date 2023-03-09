import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/')
  .post(userController.signup)

router.route('/verifyemail/:token')
  .put(userController.verifyEmail)

export default router
