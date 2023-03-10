import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/signin')
  .post(userController.signin)

export default router
