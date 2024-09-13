const { buildWhere: buildStationWhere } = require('../models/stationModel');
const { buildWhere: buildMeasurementWhere, buildJoin: buildMeasurementJoin } = require('../models/measurementModel');
const serializer = require('../serializers/serializer');
const { schema: measurementParamsSchema, handleValidation: measurementHandleValidation } = require('../validation/measurement/measurementParamsValidation');
require('dotenv').config()

let pg = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      ssl: false,
    },
    pool: { min: 0, max: parseInt(process.env.DATABASE_MAXPOOL) },
});



const getStations = async (options = {}) =>{
    
    let serializer_name = validateSerializer(options.serializer, 'station') ? options.serializer : 'default'
    
    let fields = serializer.station[serializer_name]
    
    let query = pg.table('station_prefixes').select(fields)

    if(['default'].includes(serializer_name)){                    
            query.join('stations', 'stations.id', 'station_prefixes.station_id')
            .join('cities', 'cities.id', 'stations.city_id')
            .join('ugrhis', 'ugrhis.id', 'stations.ugrhi_id')
            .join('subugrhis', 'subugrhis.id', 'stations.subugrhi_id')
            .join('station_types', 'station_types.id', 'station_prefixes.station_type_id')
            .join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')            
    }

    buildStationWhere(options, query)

    return query
}

const getMeasurements = async (options = {}) =>{
    options.serializer = options.serializer || 'default' //default value
    options.group_type = options.group_type || 'minute' //default value

    let validation = await measurementHandleValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }
    console.log(options.serializer);
    

    let fields = serializer.measurement[options.serializer]
    
    let query = pg.table('measurements').select(fields).limit(100)
    
    buildMeasurementJoin(options.serializer, query)
    buildMeasurementWhere(options, query)
    
    // let validation = {}
    
    

    return query
}


const validateSerializer = (string, type) =>{    
    let available_options = Object.keys(serializer[type])
    return available_options.includes(string)
}


const testDBConnection = () =>{
    pg.raw('SELECT 1')
        .then(result =>{
            console.log('Certo', result);
        })
}

module.exports = {
    testDBConnection,
    getStations,
    getMeasurements
}