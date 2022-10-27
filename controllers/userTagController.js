const userTagService = require('../service/user.tag.service')

class UserTagController {
    async create(req, res, next) {
        const { tags } = req.body
        const { uid } = req.user

        userTagService.create(uid, tags, (err, tags) => {
            if (err) {
                return next(err)
            }
            return res.json(tags)
        })
    }

    async getOne(req, res, next) {
        const { uid } = req.user
        
        userTagService.getOne(uid, (err, user) => {
            if (err) {
                return next(err)
            }
            return res.json(user)
        })
    }

    async delete(req, res, next) {
        const { id } = req.params
        const { uid } = req.user
        
        userTagService.delete(uid, id, (err, tags) => {
            if (err) {
                return next(err)
            }
            return res.json(tags)
        })
    }
}

module.exports = new UserTagController()