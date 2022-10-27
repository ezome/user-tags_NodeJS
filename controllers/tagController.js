const tagService = require('../service/tag.service')

class TagController {
    async create(req, res, next) {
        const { name, sortOrder } = req.body
        const { uid: creator } = req.user

        tagService.create(creator, name, sortOrder, (err, tag) => {
            if (err) {
                return next(err)
            }
            return res.json(tag)
        })
    }

    async getOne(req, res, next) {
        const { id } = req.params

        tagService.getOne(id, (err, tag) => {
            if (err) {
                return next(err)
            }

            return res.json(tag)
        })
    }

    async getAll(req, res, next) {
        const { sortByOrder, sortByName, offset, length } = req.query

        let sort = []

        if (typeof sortByOrder === 'string') sort.push({ column: 'sortOrder'});
        if (typeof sortByName === 'string')  sort.push({ column: 'name'});

        if (!sort.length) {
            sort = undefined
        }

        tagService.getAll(sort, offset, length, (err, tags) => {
            if (err) {
                return next(err)
            }
            return res.json(tags)
        })
    }

    async update(req, res, next) {
        const { name, sortOrder } = req.body
        const { uid: creator } = req.user
        const { id } = req.params

        tagService.update(id, creator, name, sortOrder, (err, newTag) => {
            if (err) {
                return next(err)
            }
            return res.json(newTag)
        })
    }

    async delete(req, res, next) {
        const { id } = req.params
        const { uid: creator } = req.user

        tagService.delete(id, creator, (err) => {
            if (err) {
                return next(err)
            }
            return res.end()
        })
    }
}

module.exports = new TagController()