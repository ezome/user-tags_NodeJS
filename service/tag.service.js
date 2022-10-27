const ApiError = require('../handlers/ApiError')
const knex = require('../db')

const useTag = async (id) => {
    return (await knex('tags')
            .join('users', {'users.uid' : 'tags.creator'})
            .select(
                knex.raw('json_build_object(\'nickname\', nickname, \'uid\', uid) AS creator'), 
                'tags.name', 
                'tags.sortOrder'
            ).whereRaw('id = ?', [id]))[0]
}

class TagService {
    async create(creator, name, sortOrder, callback) {
        if (!name) {
            return callback(ApiError.badRequest('Некорректные данные'))
        }

        const candidateName = (await knex('tags').where({ name }))[0]
        console.log(candidateName)
        if (candidateName) {
            return callback(ApiError.badRequest('Tag с таким name уже существует'))
        }

        const tag = (await knex('tags').insert({ 
            creator,
            name,
            sortOrder
        }, ['id', 'name', 'sortOrder']))[0]

        return callback(null, tag)
    }

    async getOne(id, callback) {
        const tag = await useTag(id)
        
        return (tag) ? callback(null, tag) : callback(ApiError.badRequest('Tag с таким id не найден'))
    }

    async getAll(sort = 'id', offset, length, callback) {
        const tags = await knex('tags')
            .join('users', {'users.uid' : 'tags.creator'})
            .select(
                knex.raw('json_build_object(\'nickname\', nickname, \'uid\', uid) AS creator'),
                'tags.name',
                'tags.sortOrder'
            ).limit(length).offset(offset).orderBy(sort)
        
        const data = {
            data: tags,
            meta: {
                offset,
                length,
                quantity: '???'
            }
        }
        
        return callback(null, data)
    }

    async update(id, creator, name, sortOrder, callback) {
        const candidateName = (await knex('tags').where({ name }))[0]
        if (candidateName) {
            return callback(ApiError.badRequest('Tag с таким name уже существует'))
        }

        const { id: newTagId } = (await knex('tags')
            .where({ id }).andWhere({ creator })
            .update({
                name,
                sortOrder
            }, ['id']))[0]

        if (!newTagId) {
            return  callback(ApiError.forbidden('Отказано в доступе'))
        }

        const newTag = await useTag(newTagId)

        return callback(null, newTag)
    }

    async delete(id, creator, callback) {
        const data = await knex('tags')
            .where({ 'tags.id': id }).andWhere({ creator })
            .join('userTags', {'userTags.tagId' : 'tags.id'})
            .del(['name'])
        
        return (data.length) ? callback(null) : callback(ApiError.forbidden('Отказано в доступе'))
    }
}

module.exports = new TagService()