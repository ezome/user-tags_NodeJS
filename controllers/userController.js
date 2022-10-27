const userService = require('../service/user.service')

class UserController {
    async get(req, res, next) {
        const { uid } = req.user

        userService.get(uid, (err, user) => {
            if (err) {
                return next(err)
            }
            return res.json(user)
        })
    }

    async update(req, res, next) {
        const { email, password, nickname } = req.body
        const { uid } = req.user

        userService.update(uid, email, password, nickname, (err, newUser) => {
            if (err) {
                return next(err)
            }
            return res.json(newUser)
        })
    }

    async delete(req, res, next) {
        const { uid } = req.user

        userService.delete(uid, (err) => {
            if (err) {
                return next(err)
            }
            return res.end()
        })
    }
}

module.exports = new UserController()
