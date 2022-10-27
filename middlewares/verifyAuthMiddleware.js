const tokenService = require('../service/token.service')

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    tokenService.validateToken(token, (err, user) => {
        if (err) {
            return next(err)
        }
        req.user = user

        return next()
    })
}