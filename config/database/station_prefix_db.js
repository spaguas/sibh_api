const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const updateStationPrefixField = async (station_prefix_id, obj) =>{
    return await pg.table('station_prefixes').where({id: station_prefix_id}).update(obj).returning('*');
}

module.exports = {
    updateStationPrefixField
}