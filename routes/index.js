const { Router } = require('express')
const authController = require('../controllers/authController')
const verifyAuthMiddleware = require('../middlewares/verifyAuthMiddleware')
const userRouter = require('./userRouter')
const tagRouter = require('./tagRouter')

const router = new Router()

router.post('/signin', authController.signin)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.use('/user', verifyAuthMiddleware, userRouter)
router.use('/tag', verifyAuthMiddleware, tagRouter)

module.exports = router