const ApiError = require('../handlers/ApiError')
const knex = require('../db')

const useUserTags = async (userUid) => {
    return await knex('userTags')
        .join('tags', {'tags.id' : 'userTags.tagId'})
        .where({ userUid })
        .select('tagId as id', 'name', 'sortOrder')
}


class UserTagService {
    async create(uid, tagIds, callback) {
        if (!tagIds.length) {
            return callback(ApiError.badRequest('Некорректные данные'))
        }

        const candidates = await knex('tags').whereIn('id', tagIds)
        if (candidates.length !== tagIds.length) {
            return callback(ApiError.badRequest('Недопустимые данные'))
        }

        const insertTags = tagIds.map((id) => id = { userUid: uid, tagId: id })

        await knex('userTags').insert(insertTags).onConflict().ignore()

        const tags = await useUserTags(uid)

        return callback(null, { tags })
    }

    async getOne(creator, callback) {
        const tags = await knex('tags')
            .where({ creator })
            .select('id', 'name', 'sortOrder')
        
        return callback(null, { tags })
    }

    async delete(userUid,  tagId, callback) {
        await knex('userTags')
            .where({ userUid }).andWhere({ tagId })
            .del(['id'])
        
        const tags = await useUserTags(userUid)

        return callback(null, { tags })
    }
}

module.exports = new UserTagService()