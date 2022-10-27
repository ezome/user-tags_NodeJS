const { Router } = require('express')
const tagController = require('../controllers/tagController')

const router = new Router()

router.post('/', tagController.create)
router.get('/:id', tagController.getOne)
router.get('/', tagController.getAll)
router.put('/:id', tagController.update)
router.delete('/:id', tagController.delete)

module.exports = router