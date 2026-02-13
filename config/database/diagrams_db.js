const { getMeasurements } = require("../database")
const { pg } = require("../knex")
const moment = require('moment')

const getMeasurementsFromDiagram = async (id) =>{
    
    let query = pg.table('diagrams')
    
    query.where('id', id).first()

    let response = await query
    // console.log(response.options)
    if(response){
        let stations_prefixes_ids = [...(response.options.stations?.flu || []), ...(response.options.stations?.plu || [])]
        console.log(stations_prefixes_ids)
        let options = {
            station_prefix_ids: stations_prefixes_ids,
            format: 'json',
            start_date: moment().subtract(6,'hours').toISOString(),
            end_date: moment().toISOString(),
            group_type: 'minute',
            serializer: 'default'
        }

        let measurements = await getMeasurements(options)

        return measurements
    }

    return null
    
}

module.exports = {
    getMeasurementsFromDiagram
}