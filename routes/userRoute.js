const express = require('express')
const { registerUser, loginUser, getProfile } = require('../controllers/userController')
const authUser = require('../middlewares/authUser')

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser ,getProfile)



module.exports = userRouter;