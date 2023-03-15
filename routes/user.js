import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/resetpassword/:token')
  .put(userController.resetPassword)

export default router
