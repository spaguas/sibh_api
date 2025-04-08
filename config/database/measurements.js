const { pg } = require("../knex")
const { handleValidation} = require('../../validation/measurement/nowFluParamsValidation')

const getNowMeasurementsFlu = async (options) =>{
    
    let query = pg.table('measurements')

    let validation = await handleValidation(options)

    console.log(validation);

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }
    
    let fields = [
        pg.raw('DISTINCT ON (measurements.station_prefix_id) measurements.station_prefix_id'),
        'station_prefixes.id', 'date_hour','station_prefixes.prefix','value','stations.latitude','stations.longitude','station_owners.name as station_owner', 'cities.name as city', 'ugrhis.name as ugrhi', 'subugrhis.name as subugrhi', 'station_prefixes.measurement_gap'    
    ]

    if(options.references && options.references.length > 0){
        options.references.forEach(reference=>{
            fields.push(pg.raw(`values->>'${reference}' as ${reference}`))
        })

        if(options.with_all_ref){
            options.references.forEach(reference=>{
                query.whereRaw(`values->>'${reference}' != ''`)
            })
        }
        if(options.with_one_ref){
            query.whereRaw(`(${options.references.map(x=>`values->>'${x}' != ''`).join(' or ')})`)
        }
    }

    

    query.select(fields)

    query.join('station_prefixes', 'station_prefixes.id', 'measurements.station_prefix_id')
    query.join('stations', 'stations.id', 'station_prefixes.station_id')
    query.join('cities', 'cities.id', 'stations.city_id')
    query.join('ugrhis', 'ugrhis.id', 'stations.ugrhi_id')
    query.join('subugrhis', 'subugrhis.id', 'stations.subugrhi_id')
    query.join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')
    query.joinRaw("join parameters p on p.parameterizable_id = station_prefixes.id and p.parameterizable_type = 'StationPrefix' and p.parameter_type_id = 2")

    query.whereRaw(`station_prefixes.station_type_id = 1`)
    query.whereRaw("date_hour >= now() - interval '1 day'")

    query.orderByRaw('measurements.station_prefix_id, measurements.date_hour desc')

    console.log(query.toSQL());

    return query
    
}

module.exports = {
    getNowMeasurementsFlu
}