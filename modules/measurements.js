const buildWhere = (params, query) =>{
    let whereRaw = []

    const buildClause = (param_name, table_field_name, compare_type) =>{
        let value = params[param_name]
        if(value){
            value = compare_type === 'like' ? `%${value}%` : value
            whereRaw.push(`${table_field_name} ${compare_type} '${value}'`)
        }
    }

    //construindo cláusulas analisadoras dos parâmetros passados
    buildClause('id', 'measurements.id', '=')
    buildClause('station_prefix_id', 'measurements.station_prefix_id', '=')
    buildClause('start_date', 'measurements.date_hour', '>=')
    buildClause('end_date', 'measurements.date_hour', '<=')

    if(whereRaw){
        query.whereRaw(whereRaw.join(' and '))
    }
}

const buildJoin = (serializer_name, query)=>{
    if(['short'].includes(serializer_name)){                    
        query.join('station_prefixes', 'station_prefixes.id', 'measurements.station_prefix_id')
    } else if(['default'].includes(serializer_name)){
        query.join('station_prefixes', 'station_prefixes.id', 'measurements.station_prefix_id')
             .join('stations', 'stations.id', 'station_prefixes.station_id')
             .join('cities', 'cities.id', 'stations.city_id')
             .join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')
    }
}



module.exports = {
    buildWhere,
    buildJoin
}