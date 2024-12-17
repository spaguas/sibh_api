const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const getSubugrhis = async (options = {}) =>{

    options.serializer = options.serializer || 'default'

    let fields = serializer.subugrhi[options.serializer]

    let query = pg.table('subugrhis')

    query.select(fields)
    
    query.whereRaw("cod != 9999")

    return query

}

module.exports = {
    getSubugrhis
}