const serializer = require("../serializers/serializer")

const buildSelect = (serializer_name, query) =>{
    let fields = serializer.measurement[serializer_name]
    console.log(query);
    
    query.raw(`SELECT * ${fields.join(",")}`)
}

const buildWhere = (params, query) =>{
    let whereRaw = []

    const buildClause = (param_name, table_field_name, compare_type) =>{
        let value = params[param_name]
        if(value){
            value = compare_type === 'like' ? `'%${value}%'` :  compare_type === 'in' ? `(${value})` : `'${value}'`
            whereRaw.push(`${table_field_name} ${compare_type} ${value}`)
        }
    }
    
    buildClause('station_prefix_ids', 'measurements.station_prefix_id', 'in')
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

const buildGroupBy = (query, serializer_name) =>{
    let fields = serializer.measurement[serializer_name]
    fields = fields.map(x=>x.split(' as ')[0])
    
    query.groupByRaw([...fields,  'date'].join(','))
}

const fieldsByGrouptype = _ => {

}



module.exports = {
    buildWhere,
    buildJoin,
    buildGroupBy,
    buildSelect
}