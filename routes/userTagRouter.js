const { Router } = require('express')
const userTagController = require('../controllers/userTagController')

const router = new Router()

router.post('/', userTagController.create)
router.get('/my', userTagController.getOne)
router.delete('/:id', userTagController.delete)

module.exports = router