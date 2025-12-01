const { pg, pgWD } = require("../knex")
const { handleValidation} = require('../../validation/measurement/nowFluParamsValidation')
const { handleValidation: WDMeasurementValidation} = require('../../validation/measurement/newMeasurementWDValidation')

const getNowMeasurementsFlu = async (options) =>{
    
    let query = pg.table('measurements')

    let validation = await handleValidation(options)


    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }
    
    let fields = [
        pg.raw('DISTINCT ON (measurements.station_prefix_id) measurements.station_prefix_id'),
        'station_prefixes.id', 'stations.name as station_name', 'date_hour','station_prefixes.prefix','value','read_value','stations.latitude','stations.longitude','station_owners.name as station_owner', 'cities.id as city_id','cities.name as city', 'cities.cod_ibge as cod_ibge', 'ugrhis.id as ugrhi_id', 'ugrhis.name as ugrhi', 'subugrhis.id as subugrhi_id', 'subugrhis.name as subugrhi', 'station_prefixes.measurement_gap', 'station_prefixes.net_group', 'station_prefixes.public'
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
    query.whereRaw("date_hour >= now() - interval '3 hours'")
    query.whereRaw("public = true")

    query.orderByRaw('measurements.station_prefix_id, measurements.date_hour desc')

    console.log(query.toSQL());

    return query
    
}

const newMeasurementWD = async (options) =>{
    let validation = await WDMeasurementValidation(options)

    let query = pgWD.table('measurements')

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    try{
        await query.insert(options).returning('*');

        console.log('Medição cadastrada')
        return {message: 'Alerta criado com sucesso', status:200}

    } catch (e){
        console.log('Erro ao criar medição webservicedata', e)
        return {message: 'Erro ao criar medição', error: e.detail, status:500}
    }

}

const updateMeasurementFields = async (measurement_id, obj) =>{
    return await pg.table('measurements').where({id: measurement_id}).update(obj).returning('*');
}

module.exports = {
    getNowMeasurementsFlu,
    newMeasurementWD,
    updateMeasurementFields
}