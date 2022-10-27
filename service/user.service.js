const bcrypt = require('bcrypt')
const tokenService = require('./token.service')
const ApiError = require('../handlers/ApiError')
const knex = require('../db')
const db = knex('users')

class UserService {
    async get(uid, callback) {
        const user = (await knex('users')
            .select('email', 'nickname')
            .whereRaw('uid = ?', [uid]))[0]

        const tags = await knex('userTags')
            .join('tags', {'tags.id' : 'userTags.tagId'})
            .where({ userUid: uid })
            .select('tagId as id', 'name', 'sortOrder')

        const data = { ...user, tags }

        return callback(null, data)
    }

    async update(uid, email, password, nickname, callback) {
        if (!email && !password && !nickname) {
            return callback(ApiError.badRequest('Некорректные данные'))
        }

        const candidateEmail = (email) ? (await knex('users').where({ email }))[0] : undefined
        if (candidateEmail) {
            return callback(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const candidateNickname = (nickname) ? (await knex('users').where({ nickname }))[0] : undefined
        if (candidateNickname) {
            return callback(ApiError.badRequest('Пользователь с таким nickname уже существует'))
        }

        const hashPassword = (password) ? (await bcrypt.hash(password, 3)) : undefined

        const newUser = (await knex('users')
            .where({ uid })
            .update({ 
                email, 
                nickname,
                password: hashPassword
            }, ['email', 'nickname']))[0]
        
        return callback(null, newUser)
    }

    async delete(req, res, next) {
        // delete && logout
    }
}

module.exports = new UserService()