const { pg } = require("../knex")
const {buildWhere} = require('../../models/newMeasurementModel')
const serializer = require("../../serializers/serializer")

const getMeasurements = async (options = {}) =>{
    let query = pg.table('new_measurements')
    let fields = serializer.new_measurement.default

    query.select(fields)
    
    buildWhere(options, query)

    query.orderByRaw('date_hour desc')

    return query
}

module.exports = {
    getMeasurements
}