import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.route('/')
  .post(userController.signup)

export default router
