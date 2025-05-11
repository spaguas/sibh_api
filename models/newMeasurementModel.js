const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'start_date', 'new_measurements.date_hour', '>='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'end_date', 'new_measurements.date_hour', '<='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_prefix_ids', 'new_measurements.station_prefix_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cod_ibge', 'cities.cod_ibge', '='))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

const buildJoin = (params, query) =>{
    if(params.cod_ibge){                    
        query.join('station_prefixes', 'station_prefixes.id', 'new_measurements.station_prefix_id')
        query.join('stations', 'stations.id', 'station_prefixes.station_id')
        query.join('cities', 'cities.id', 'stations.city_id')
    }
}



module.exports = {
    buildWhere,
    buildJoin
}