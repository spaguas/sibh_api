const { getMeasurements } = require("../database")
const { pg } = require("../knex")
const moment = require('moment')
const { getParameters } = require("./parameter_db")

const getMeasurementsFromDiagram = async (id) =>{
    
    let query = pg.table('diagrams')
    
    query.where('id', id).first()

    let response = await query
    // console.log(response.options)
    if(response){
        let prefixes_flu = response.options.stations?.flu || []
        let stations_prefixes_ids = [...prefixes_flu, ...(response.options.stations?.plu || [])]

        let options = {
            station_prefix_ids: stations_prefixes_ids,
            format: 'json',
            start_date: moment().subtract(6,'hours').toISOString(),
            end_date: moment().toISOString(),
            group_type: 'minute',
            serializer: 'default'
        }

        const [measurements, parameters] = await Promise.all([
            getMeasurements(options),
            getParameters({parameter_type_id:2, parameterizable_type:'StationPrefix', parameterizable_ids:prefixes_flu})
        ])

        return {measurements, parameters}
    }

    return null
    
}

module.exports = {
    getMeasurementsFromDiagram
}