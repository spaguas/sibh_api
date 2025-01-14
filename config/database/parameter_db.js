const { handleValidation: getParameterValidation} = require('../../validation/parameter/getParameterParamsValidation')
const { pg } = require('../knex')
const {buildWhere: buildParameterWhere} = require('../../models/parameterModel')
const serializer = require('../../serializers/serializer')

const getParameters = async (options={}) =>{
    options.serializer = options.serializer || 'default'
    
    let validation = await getParameterValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    let fields = serializer.parameter[options.serializer]

    let query = pg.table('parameters').select(fields)
    
    buildParameterWhere(options, query)    

    return query
}

module.exports = {
    getParameters
}