const { Router } = require('express')
const userController = require('../controllers/userController')
const userTagRouter = require('./userTagRouter')

const router = new Router()

router.get('/', userController.get)
router.put('/', userController.update)
router.delete('/', userController.delete)

router.use('/tag', userTagRouter)

module.exports = router