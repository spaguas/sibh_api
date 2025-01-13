const { buildWhere: buildStationWhere } = require('../models/stationModel');
const { buildSelect: buildMeasurementSelect, buildWhere: buildMeasurementWhere, buildJoin: buildMeasurementJoin, buildGroupBy: buildMeasurementGroupBy} = require('../models/measurementModel');
const serializer = require('../serializers/serializer');
const { handleValidation: measurementHandleValidation } = require('../validation/measurement/measurementParamsValidation');

const { handleValidation: newParameterValidation} = require('../validation/parameter/newParameterParamsValidation')
const { handleValidation: getParameterValidation} = require('../validation/parameter/getParameterParamsValidation')


// const { additionalObjects: citiesAdditionalObjects} = require('../modules/cities');
const { buildWhere: buildParameterWhere} = require('../models/parameterModel');

const {pg} = require('./knex')


const getStations = async (options = {}) =>{
    
    let serializer_name = validateSerializer(options.serializer, 'station') ? options.serializer : 'default'
    
    let fields = serializer.station[serializer_name]
    
    if(serializer_name === 'complete'){
        fields.push(pg.raw("CASE WHEN transmission_status = 0 THEN 'ok' ELSE 'pendente' END AS transmission_status"))
    }

    let query = pg.table('station_prefixes').select(fields)    
    

    if(['default', 'complete'].includes(serializer_name)){                    
            query.join('stations', 'stations.id', 'station_prefixes.station_id')
            .join('cities', 'cities.id', 'stations.city_id')
            .join('ugrhis', 'ugrhis.id', 'stations.ugrhi_id')
            .join('subugrhis', 'subugrhis.id', 'stations.subugrhi_id')
            .join('station_types', 'station_types.id', 'station_prefixes.station_type_id')
            .join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')            
    }

    buildStationWhere(options, query)

    query = await query //executando ela

    if(options.parameter_type_ids && options.parameter_type_ids.length > 0){   
        
        let parameters = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: query.map(x=>x.id), parameter_type_ids: options.parameter_type_ids})
        
        query.map(station_prefix=>station_prefix.parameters = parameters.filter(x=> x.parameterizable_type === 'StationPrefix' && x.parameterizable_id === station_prefix.id))
    }   
    

    return query
}

const getMeasurements = async (options = {}) =>{   

    let fields = [...serializer.measurement[options.serializer], pg.raw('COUNT(value) as qtd'), 
        pg.raw('CASE WHEN station_prefixes.station_type_id = 2 THEN SUM(value) ELSE AVG(value) END as value'),
        pg.raw('CASE WHEN station_prefixes.station_type_id = 2 THEN SUM(read_value) ELSE AVG(read_value) END as read_value'),
    ]    

    if(options.group_type != 'minute'){
        fields.push(pg.raw('MAX(value) as max_value'))
        fields.push(pg.raw('MIN(value) as min_value'))
        fields.push(pg.raw('MIN(date_hour) as min_date'))
        fields.push(pg.raw('MAX(date_hour) as max_date'))
    }

    if(options.group_type != 'all'){
        fields.push(pg.raw(
            options.group_type === 'minute' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24:MI') AS date" :
            options.group_type === 'hour' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24') AS date" :
            options.group_type === 'day' ? "TO_CHAR(date_hour, 'YYYY/MM/DD') AS date" :
            options.group_type === 'month' ? "TO_CHAR(date_hour, 'YYYY/MM') AS date" :
            "TO_CHAR(date_hour, 'YYYY') AS date"))
    }     
    
    let query = pg.table('measurements')

    query.select(fields)
    
    buildMeasurementJoin(options.serializer, query)
    buildMeasurementWhere(options, query)
    buildMeasurementGroupBy(query,options.serializer,options.group_type)

    query.orderByRaw(`station_prefix_id ${options.group_type != 'all' ? ", date desc" : ""}`);

    console.log(query.toSQL());

    return query
}
const getParameters = async (options = {}) =>{
    
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

const newParameters = async (options ={}) =>{
    let validation = await newParameterValidation(options)
    

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    return {}
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
    getParameters,
    newParameters
}