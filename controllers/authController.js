const authService = require('../service/auth.service')

class AuthController {
    async signin(req, res, next) {
        const { email, password, nickname } = req.body
        authService.signin(email, password, nickname, (err, token) => {
            if (err) {
                return next(err)
            }
            return res.json(token)
        })
    }
    
    async login(req, res, next) {
        const { email, password } = req.body
        authService.login(email, password, (err, token) => {
            if (err) {
                return next(err)
            }
            return res.json(token)
        })
    }

    async logout(req, res, next) {
        // logout
    }
}

module.exports = new AuthController()