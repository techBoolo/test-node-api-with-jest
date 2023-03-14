import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/forgotpassword')
  .post(userController.forgotPassword)

export default router
