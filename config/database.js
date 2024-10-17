const { buildWhere: buildStationWhere } = require('../models/stationModel');
const { buildSelect: buildMeasurementSelect, buildWhere: buildMeasurementWhere, buildJoin: buildMeasurementJoin, buildGroupBy: buildMeasurementGroupBy} = require('../models/measurementModel');
const { buildWhere: buildCityWhere} = require('../models/cityModel')
const serializer = require('../serializers/serializer');
const { schema: measurementParamsSchema, handleValidation: measurementHandleValidation } = require('../validation/measurement/measurementParamsValidation');


// const { additionalObjects: citiesAdditionalObjects} = require('../modules/cities');
const { buildWhere: buildParameterWhere} = require('../models/parameterModel');
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

    let fields = [...serializer.measurement[options.serializer], pg.raw('SUM(value) as sum_value'),  pg.raw(
        options.group_type === 'minute' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24:MI') AS date" :
        options.group_type === 'hour' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24') AS date" :
        options.group_type === 'day' ? "TO_CHAR(date_hour, 'YYYY/MM/DD') AS date" :
        options.group_type === 'month' ? "TO_CHAR(date_hour, 'YYYY/MM') AS date" :
        "TO_CHAR(date_hour, 'YYYY') AS date"
    ) ]

    
    
    
    let query = pg.table('measurements')

    query.select(fields)
    
    // buildMeasurementSelect(options.serializer,query)
    buildMeasurementJoin(options.serializer, query)
    buildMeasurementWhere(options, query)
    buildMeasurementGroupBy(query,options.serializer)
    // let validation = {}

    query.limit(100)
    
    console.log(query.toSQL());
    

    return query
}

const getCities = async (options = {}) =>{
    let serializer_name = 'very_short'
    let fields = serializer.city[serializer_name]
    
    let query = pg.table('cities').select(fields)
    
    // buildMeasurementJoin(serializer_name, query)

    buildCityWhere(options, query)
    

    query = await query //executando ela

    if(options.parameter_type_ids && options.parameter_type_ids.length > 0){   
        
        let parameters = await getParameters({parameterizable_type: 'City', parameterizable_ids: query.map(x=>x.id), parameter_type_ids: options.parameter_type_ids})
        
        query.map(city=>city.parameters = parameters.filter(x=> x.parameterizable_type === 'City' && x.parameterizable_id === city.id))
    } 


    return query
}

const getParameters = async (options = {}) =>{
    let fields = serializer.parameter['default']
    let query = pg.table('parameters').select(fields)
    
    buildParameterWhere(options, query)

    console.log(query.toString());
    

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
    getMeasurements,
    getCities,
    getParameters
}