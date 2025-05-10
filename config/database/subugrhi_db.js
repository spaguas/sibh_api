const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const getSubugrhis = async (options = {}) =>{

    options.serializer = options.serializer || 'default'

    let fields = serializer.subugrhi[options.serializer]

    let query = pg.table('subugrhis')

    if(options.with_bbox){
        fields = [...fields, 'bbox_json']
    }

    query.select(fields)
    
    query.whereRaw("cod != 9999")

    return query

}

module.exports = {
    getSubugrhis
}