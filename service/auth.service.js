const bcrypt = require('bcrypt')
const tokenService = require('./token.service')
const ApiError = require('../handlers/ApiError')
const knex = require('../db')

class AuthService {
    async signin(email, password, nickname, callback) {
        if (!email || !password || !nickname) {
            return callback(ApiError.badRequest('Некорректные данные'))
        }

        const candidateEmail = (await knex('users').where({ email }))[0]
        if (candidateEmail) {
            return callback(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const candidateNickname = (await knex('users').where({ nickname }))[0]
        if (candidateNickname) {
            return callback(ApiError.badRequest('Пользователь с таким nickname уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const { uid } = (await knex('users').insert({ 
            uid: knex.raw('gen_random_uuid()'), 
            email, 
            nickname,
            password: hashPassword
        }, ['uid']))[0]

        const token = tokenService.generateToken(uid)

        return callback(null, token)
    }

    async login(email, password, callback) {
        const candidate = (await knex('users').where({ email }))[0]
        if (!candidate) {
            return callback(ApiError.badRequest('Пользователь с таким email не найден'))
        }

        const comparePassword = await bcrypt.compare(password, candidate.password)
        if (!comparePassword) {
            return callback(ApiError.badRequest('Неверный пароль'))
        }

        const token = tokenService.generateToken(candidate.uid)

        return callback(null, token)
    }

    async logout(req, res, next) {
        // logout
    }
}

module.exports = new AuthService()