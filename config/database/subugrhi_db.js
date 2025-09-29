const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")
const { buildWhere: buildSubugrhiWhere} = require('../../models/subugrhiModel')

const getSubugrhis = async (options = {}) =>{

    options.serializer = options.serializer || 'default'

    let fields = serializer.subugrhi[options.serializer]

    let query = pg.table('subugrhis')

    if(options.with_bbox){
        fields = [...fields, 'bbox_json']
    }

    query.select(fields)
    
    buildSubugrhiWhere(options,query)

    return query

}

const getSubugrhisJson = async () =>{
    return await pg.withSchema('maps').select('n_subugrhi', 'no_subugrh', pg.raw('ST_AsGeoJSON(ST_Simplify(geom,0.01)) as geometry_json'), 'n_ugrhi', 'no_ugrhi').from('subugrhis_sp')
}

module.exports = {
    getSubugrhis,
    getSubugrhisJson
}