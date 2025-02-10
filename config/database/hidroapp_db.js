const serializer = require("../../serializers/serializer")
const {getAdditionalObjects, buildWhere} = require('../../models/hidroappModel')
const { pg } = require("../knex")
const { options } = require("joi")
const { handleValidation: hidroStatsValidation } = require("../../validation/hidroAppStats/hidroAppStatsValidation")

const getHidroAppData = async (options={}) =>{
    
    let fields = [...serializer.hidroapp.default]

    let query = pg.table('hidroapp_statistics')

    let validation = await hidroStatsValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }   

    // buildJoin(options, query)

    buildWhere(options, query)

    query.select(fields)
    
    query.orderByRaw('model_id, date_hour desc')    

    query = await query

    objects = await getAdditionalObjects(query)

    return {data: query, ...objects}

}

module.exports = {
    getHidroAppData
}