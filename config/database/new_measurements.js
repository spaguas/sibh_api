const { pg } = require("../knex")
const {buildWhere, buildJoin} = require('../../models/newMeasurementModel')
const serializer = require("../../serializers/serializer")
const { JSONBAggregationString, dateByGroupType } = require("../../helpers/generalHelper")

const getMeasurements = async (options = {}) =>{
    
    let fields = [...serializer.new_measurement.default]

    if(options.group_type != 'minute'){
        fields.push(pg.raw(dateByGroupType(options.group_type)))
        fields.push(pg.raw(JSONBAggregationString(['ph', 'rain', 'temp', 'oxygen', 'turbidity', 'conductivity'])))
    } else {
        fields.push(pg.raw("date_hour as date, values"))
    }

    let query = pg.table('new_measurements')

    buildJoin(options, query)

    query.select(fields)
    
    buildWhere(options, query)
    
    if(options.group_type != 'minute'){
        query.groupByRaw(['station_prefix_id, date'].join(','))
    }
    console.log('wtf')
    query.orderByRaw('date desc')

    console.log(query.toSQL());
    

    return query
}

module.exports = {
    getMeasurements
}