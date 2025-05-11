// const { getMeasurements, getParameters } = require('../config/database');
const {getParameters} = require('../config/database/parameter_db')
const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'prefix', 'prefix', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'name', 'stations.name', 'like'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_type', 'station_types.name', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_type_id', 'station_type_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'city_id', 'stations.city_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cod_ibge', 'cities.cod_ibge', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ugrhi_id', 'stations.ugrhi_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ugrhi_cod', 'ugrhis.cod', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ugrhi_name', 'ugrhis.name', 'like'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'subugrhi_id', 'stations.subugrhi_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_owner_id', 'station_prefixes.station_owner_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_owner_ids', 'station_prefixes.station_owner_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_owner', 'station_owners.name', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'parameterizable_id', 'parameters.parameterizable_id', '='))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

const appendParametersOfStation = async (data, station_id) =>{
        
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