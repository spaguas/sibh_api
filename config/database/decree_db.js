const { buildWhere, buildJoin } = require("../../models/decreeCityModel")
const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")


const getCityDecrees = async (options = {}) =>{

    options.serializer = options.serializer || 'default'

    let fields = serializer.city_decree[options.serializer]

    if(!fields){
        return {error: `Serializer ${options.serializer} not found for City Decree`}
    }

    let query = pg.table('city_decrees')

    query.select(fields)

    buildWhere(options, query)

    buildJoin(options, query)

    return query

}

module.exports = {
    getCityDecrees
}