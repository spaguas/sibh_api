const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'start_date', 'new_measurements.date_hour', '>='))
    whereRaw.push(buildClause(params,'end_date', 'new_measurements.date_hour', '<='))
    whereRaw.push(buildClause(params,'station_prefix_ids', 'new_measurements.station_prefix_id', 'in'))
    whereRaw.push(buildClause(params,'cod_ibge', 'cities.cod_ibge', '='))

    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
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