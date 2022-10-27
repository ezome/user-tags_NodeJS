const JWT = require('jsonwebtoken')
const ApiError = require('../handlers/ApiError')


class TokenService {
    expire = 1800

    generateToken(uid) {
        const token = JWT.sign({uid}, process.env.SECRET_KEY, {expiresIn: this.expire})
        return { token, expire: this.expire }
    }

    validateToken(token, callback) {
        if (!token) {
            return callback(ApiError.unauthorized('Требуется аутентификация'))
        }
    
        return JWT.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return callback(ApiError.unauthorized('Требуется повторная аутентификация'))
            }
            return callback(null, decoded)
        })
    }

    removeToken() {
        // remove token
    }
}

module.exports = new TokenService()

