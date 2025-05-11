const buildClause = (params, param_name, table_field_name, compare_type) =>{
    let value = params[param_name]

    if(value){
        value = compare_type === 'like' ? `%${value}%` : compare_type === 'in' ? `(${value})` : compare_type === 'in_str' ? `(${value.map(v => `'${v}'`).join(',')})` : `'${value}'`
        return `${table_field_name} ${compare_type === 'in_str' ? 'in' : compare_type} ${value}`
    } else {
        return ''
    }
}

const buildClauseNew = (params, param_name, table_field_name, compare_type) =>{
    let value = params[param_name]

    if (!value) return undefined;

    let clause, bindings;

    switch (compare_type) {
        case 'like':
            clause = `${table_field_name} LIKE ?`;
            bindings = [`%${value}%`];
            break;

        case 'in':
            if (!Array.isArray(value)) value = [value];
            clause = `${table_field_name} IN (${value.map(() => '?').join(', ')})`;
            bindings = value;
            break;

        case 'in_str':
            if (!Array.isArray(value)) value = [value];
            clause = `${table_field_name} IN (${value.map(() => '?').join(', ')})`;
            bindings = value.map(String);
            break;
        
        case '>=':
            clause = `${table_field_name} >= ?`;
            bindings = value;
            break;

        case '<=':
            clause = `${table_field_name} <= ?`;
            bindings = value;
            break;


        default:
            clause = `${table_field_name} = ?`;
            bindings = [value];
    }

    return { clause, bindings };
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
    dateByGroupType,
    buildClauseNew
}