const moment = require('moment')
const serializer = require("../serializers/serializer")
const { buildClauseNew } = require('../helpers/generalHelper')


const filterRainingNowData = (data, params) =>{
    let {last_hours,station_type_id, show_all,group_type} = params
    let date = moment().subtract(last_hours, 'hours')
    let flu = []
    let plu = {}

    data.forEach(measurement =>{
        
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
    
    return station_type_id === '1' ? flu : Object.values(plu).filter(x=>x.value >= (show_all ? 0 : 1 ))
}

const buildWhere = (params, query) =>{
    console.log(params);
    
    let clauses = []
    clauses.push({ clause: 'value != ?', bindings: ['NaN'] });
    clauses.push({ clause: `measurement_classification_type_id in (${params.authorized ? '?,?,?,?' : '?,?,?'})`, bindings:  (params.authorized ? [1, 2, 3,4] : [1, 2, 3]) }); //removendo dados marcados como 'suspeito(id 4)' e só exibindo caso o usuario seja ADMIN

    if(params['hours']){
        let date_format = 'YYYY-MM-DD HH:mm'
        let end_date = params['from_date'] ? moment(params['from_date'], date_format) : moment()
        let start_date = end_date.clone().subtract(params['hours'], 'hours')
        clauses.push({ clause: 'date_hour >= ? and date_hour <= ?', bindings: [start_date.format(date_format), end_date.format(date_format)] })
    }

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'station_prefix_ids', 'measurements.station_prefix_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'start_date', 'measurements.date_hour', '>='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'end_date', 'measurements.date_hour', '<='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_type_id', 'station_prefixes.station_type_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'public', 'station_prefixes.public', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cod_ibge', 'cities.cod_ibge', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'station_owner_ids', 'station_prefixes.station_owner_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'param_type', 'measurements.param_type', '='))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

const buildJoin = (serializer_name, query, options={})=>{
    let joins = {}
    if(options.cod_ibge){
        joins['station_prefixes'] = ['station_prefixes.id', 'measurements.station_prefix_id']
        joins['stations'] = ['stations.id', 'station_prefixes.station_id']
        joins['cities'] = ['cities.id', 'stations.city_id']
    } 
    if(['very_short','short'].includes(serializer_name)){                    
        joins['station_prefixes'] = ['station_prefixes.id', 'measurements.station_prefix_id']
    } 
    if(['default', 'complete'].includes(serializer_name)){
        joins['station_prefixes'] = ['station_prefixes.id', 'measurements.station_prefix_id']
        joins['stations'] = ['stations.id', 'station_prefixes.station_id']
        joins['cities'] = ['cities.id', 'stations.city_id']
        joins['ugrhis'] = ['ugrhis.id', 'stations.ugrhi_id']
        joins['subugrhis'] = ['subugrhis.id', 'stations.subugrhi_id']
        joins['transmission_types'] = ['transmission_types.id', 'measurements.transmission_type_id']
        joins['station_owners'] = ['station_owners.id', 'station_prefixes.station_owner_id']
    }
    if(options.station_owner_ids){
        joins['station_prefixes'] = ['station_prefixes.id', 'measurements.station_prefix_id']
    }
    Object.keys(joins).map(table=>{
        query.join(table, joins[table][0], joins[table][1])
    })
}

const buildGroupBy = (query, serializer_name,group_type) =>{
    let fields = serializer.measurement[serializer_name]
    
    
    fields = fields.map(x=>x.split(' as ')[0]).filter(x=> !['value', 'read_value'].includes(x))

    if(group_type != 'all'){
        fields.push('date')
    } 
    if(group_type === 'minute'){
        fields.push('measurements.id')
    }
    
    query.groupByRaw([...fields].join(','))
}

const prepareToCSV = (data) =>{
    const header = 'Prefixo,Nome,TipoPosto,Data,Valor,Valor2\n';

    // Concatena os dados
    const linhas = data.map(d => `${d.prefix},${d.station_name},${d.station_type_id},${d.date},${d.value},${d.read_value}`).join('\n');
  
    return header + linhas;
}

module.exports = {
    buildWhere,
    buildJoin,
    buildGroupBy,
    filterRainingNowData,
    prepareToCSV
}