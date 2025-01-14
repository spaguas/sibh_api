// const { getMeasurements, getParameters } = require('../config/database');
const {getParameters} = require('../config/database/parameter_db')
const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'prefix', 'prefix', '='))
    whereRaw.push(buildClause(params,'name', 'stations.name', 'like'))
    whereRaw.push(buildClause(params,'station_type', 'station_types.name', '='))
    whereRaw.push(buildClause(params,'station_type_id', 'station_type_id', '='))
    whereRaw.push(buildClause(params,'city_id', 'stations.city_id', '='))
    whereRaw.push(buildClause(params,'cod_ibge', 'cities.cod_ibge', '='))
    whereRaw.push(buildClause(params,'ugrhi_id', 'stations.ugrhi_id', '='))
    whereRaw.push(buildClause(params,'ugrhi_cod', 'ugrhis.cod', '='))
    whereRaw.push(buildClause(params,'ugrhi_name', 'ugrhis.name', 'like'))
    whereRaw.push(buildClause(params,'subugrhi_id', 'stations.subugrhi_id', '='))
    whereRaw.push(buildClause(params,'station_owner_id', 'station_prefixes.station_owner_id', '='))
    whereRaw.push(buildClause(params,'station_owner_ids', 'station_prefixes.station_owner_id', 'in'))
    whereRaw.push(buildClause(params,'station_owner', 'station_owners.name', '='))

    whereRaw.push(buildClause(params, 'parameterizable_id', 'parameters.parameterizable_id', '='))

    if(whereRaw.length > 1){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}

const appendParametersOfStation = async (data, station_id) =>{
    console.log(getParameters);
    
    let parameters = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: [station_id]})
        
    data.parameters = parameters

    return data
}

const appendParametersOfStations = async (data, params) =>{
    
}



module.exports = {
    buildWhere,
    appendParametersOfStation,
    appendParametersOfStations
}