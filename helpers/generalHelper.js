const buildClause = (params, param_name, table_field_name, compare_type) =>{
    let value = params[param_name]
    
    if(value){
        value = compare_type === 'like' ? `%${value}%` :  compare_type === 'in' ? `(${value})` : `'${value}'`
        return `${table_field_name} ${compare_type} ${value}`
    } else {
        return ''
    }
}

const JSONBAggregationString = (fields) =>{
    // return `jsonb_build_object(
    //     ${fields.map(field=>{
    //         return `
    //         '${field}', 
    //         jsonb_build_object(
    //             'value', ${aggregationsFunctions[field]}((values->'${field}'->>'value')::float),
    //             'qtd', COUNT((values->'${field}'->>'value')::float),
    //             'max', MAX((values->'${field}'->>'value')::float),
    //             'min', MIN((values->'${field}'->>'value')::float)
    //         )
    //         `
    //     })}
        
    // ) AS values`
    return `jsonb_build_object(
        'avg', AVG((values->'value'->>'value')::float),
        'sum', SUM((values->'value'->>'value')::float),
        'qtd', COUNT((values->'value'->>'value')::float),
        'max', MAX((values->'value'->>'value')::float),
        'min', MIN((values->'value'->>'value')::float)
    ) as values`
}

const dateByGroupType = type =>{
    return type === 'minute' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24:MI') AS date" :
    type === 'hour' ? "TO_CHAR(date_hour, 'YYYY/MM/DD HH24') AS date" :
    type === 'day' ? "TO_CHAR(date_hour, 'YYYY/MM/DD') AS date" :
    type === 'month' ? "TO_CHAR(date_hour, 'YYYY/MM') AS date" :
    "TO_CHAR(date_hour, 'YYYY') AS date"
}

const aggregationsFunctions = {
    rain: 'SUM',
    ph: 'AVG',
    temp: 'AVG',
    oxygen: 'AVG',
    turbidity: 'AVG',
    conductivity: 'AVG',

}

module.exports = {
    buildClause,
    aggregationsFunctions,
    JSONBAggregationString,
    dateByGroupType
}