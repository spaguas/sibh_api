const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const getUgrhis = async (options = {}) =>{

    options.serializer = options.serializer || 'default'

    let fields = serializer.ugrhi[options.serializer]

    let query = pg.table('ugrhis')

    query.select(fields)
    
    query.whereRaw("cod != 99")

    return query
    

}

module.exports = {
    getUgrhis
}