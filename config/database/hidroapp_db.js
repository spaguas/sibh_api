const serializer = require("../../serializers/serializer")
const {buildWhere,buildWhereView} = require('../../models/hidroappModel')
const { pg } = require("../knex")
const { options } = require("joi")
const { handleValidation: hidroStatsValidation } = require("../../validation/hidroAppStats/hidroAppStatsValidation")
const { handleValidation: hidroStatsViewValidation } = require("../../validation/hidroAppStats/hidroAppStatsViewValidation")

const getHidroAppData = async (options={}) =>{
    
    let fields = [...serializer.hidroapp.default]

    let query = pg.table('hidroapp_statistics')

    let validation = await hidroStatsValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    buildWhere(options, query)

    query.select(fields)
    
    query.orderByRaw('model_id, date_hour desc')    

    query = await query

    return {data: query}

}

const getHidroAppViewData = async (options={}) =>{
    let fields = [...serializer.hidroappview.default]

    let query = pg.table('hidroapp_statistics_view')

    let validation = await hidroStatsViewValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    buildWhereView(options, query)

    query.select(fields)
    
    query.orderByRaw('model_id')    

    query = await query

    return {data: query}
}

module.exports = {
    getHidroAppData,
    getHidroAppViewData
}