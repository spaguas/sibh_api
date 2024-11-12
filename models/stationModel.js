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
    buildClause('prefix', 'prefix', '=')
    buildClause('name', 'stations.name', 'like')
    buildClause('station_type', 'station_types.name', '=')
    buildClause('station_type_id', 'station_type_id', '=')
    buildClause('city_id', 'stations.city_id', '=')
    buildClause('cod_ibge', 'cities.cod_ibge', '=')
    buildClause('ugrhi_id', 'stations.ugrhi_id', '=')
    buildClause('ugrhi_cod', 'ugrhis.cod', '=')
    buildClause('ugrhi_name', 'ugrhis.name', 'like')
    buildClause('subugrhi_id', 'stations.subugrhi_id', '=')
    buildClause('station_owner_id', 'station_prefixes.station_owner_id', '=')
    buildClause('station_owner_ids', 'station_prefixes.station_owner_id', 'in')
    buildClause('station_owner', 'station_owners.name', '=')

    if(whereRaw){
        query.whereRaw(whereRaw.join(' and '))
    }
}



module.exports = {
    buildWhere
}