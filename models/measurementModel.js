const moment = require('moment')
const serializer = require("../serializers/serializer")

const buildSelect = (serializer_name, query) =>{
    let fields = serializer.measurement[serializer_name]
    
    query.raw(`SELECT * ${fields.join(",")}`)
}

const filterRainingNowData = (data, params) =>{
    let {last_hours,station_type_id, show_all,group_type} = params
    let date = moment().subtract(last_hours, 'hours')
    let flu = []
    let plu = {}

    data.forEach(measurement =>{
        console.log(measurement);
        
        if(moment(measurement.date, station_type_id === "1" ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD HH" ) >= date){
            if(station_type_id === '1'){
                flu.push(measurement)
            } else {
                if(!plu[measurement.station_prefix_id]){
                    plu[measurement.station_prefix_id] = measurement
                } else {
                    let date = plu[measurement.station_prefix_id].max_date
                    plu[measurement.station_prefix_id].value += measurement.value
                    plu[measurement.station_prefix_id].qtd = parseInt(plu[measurement.station_prefix_id].qtd) +  parseInt(measurement.qtd)
                    // plu[measurement.station_prefix_id].bb = date ? moment(date, "YYYY/MM/DD HH:mm") > moment(measurement.max_date, "YYYY/MM/DD HH:mm") ? date : measurement.max_date : measurement.max_date
                    // plu[measurement.station_prefix_id].aa = date ? moment(date, "YYYY/MM/DD HH:mm") < moment(measurement.min_date, "YYYY/MM/DD HH:mm") ? date : measurement.min_date : measurement.min_date
                }
            }
        }
    })    
    
    console.log(plu);
    
    return station_type_id === '1' ? flu : Object.values(plu).filter(x=>x.value >= (show_all ? 0 : 1 ))
}

const buildWhere = (params, query) =>{
    let whereRaw = ["value != 'NaN'"]
    console.log(params);
    

    const buildClause = (param_name, table_field_name, compare_type) =>{
        let value = params[param_name]
        if(value){

            if(param_name === 'hours'){
                let date_format = 'YYYY-MM-DD HH:mm'
                let end_date = params['from_date'] ? moment(params['from_date'], date_format) : moment()
                let start_date = end_date.clone().subtract(value, 'hours')
                whereRaw.push(`date_hour >= '${start_date.format(date_format)}' and date_hour <= '${end_date.format(date_format)}'`)
            } else {
                value = compare_type === 'like' ? `'%${value}%'` :  compare_type === 'in' ? `(${value})` : `'${value}'`
                whereRaw.push(`${table_field_name} ${compare_type} ${value}`)
            }

            
        }
    }
    
    buildClause('station_prefix_ids', 'measurements.station_prefix_id', 'in')
    buildClause('start_date', 'measurements.date_hour', '>=')
    buildClause('end_date', 'measurements.date_hour', '<=')
    buildClause('hours', 'measurements.date_hour', '<=')
    buildClause('station_type_id', 'station_prefixes.station_type_id', '=')
    buildClause('public', 'station_prefixes.public', '=')

    if(whereRaw){
        query.whereRaw(whereRaw.join(' and '))
    }
}

const buildJoin = (serializer_name, query)=>{
    if(['very_short','short'].includes(serializer_name)){                    
        query.join('station_prefixes', 'station_prefixes.id', 'measurements.station_prefix_id')
    } else if(['default', 'complete'].includes(serializer_name)){
        query.join('station_prefixes', 'station_prefixes.id', 'measurements.station_prefix_id')
            .join('stations', 'stations.id', 'station_prefixes.station_id')
            .join('cities', 'cities.id', 'stations.city_id')
            .join('ugrhis', 'ugrhis.id', 'stations.ugrhi_id')
            .join('subugrhis', 'subugrhis.id', 'stations.subugrhi_id')
            .join('transmission_types', 'transmission_types.id', 'measurements.transmission_type_id')
            .join('station_owners', 'station_owners.id', 'station_prefixes.station_owner_id')
    }
}

const buildGroupBy = (query, serializer_name,group_type) =>{
    let fields = serializer.measurement[serializer_name]
    
    
    fields = fields.map(x=>x.split(' as ')[0]).filter(x=> !['value', 'read_value'].includes(x))

    if(group_type != 'all'){
        fields.push('date')
    } 
    
    query.groupByRaw([...fields].join(','))
}

const fieldsByGrouptype = _ => {

}



module.exports = {
    buildWhere,
    buildJoin,
    buildGroupBy,
    buildSelect,
    filterRainingNowData
}