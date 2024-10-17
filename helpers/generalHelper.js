const buildClause = (params, param_name, table_field_name, compare_type) =>{
    let value = params[param_name]
    
    if(value){
        value = compare_type === 'like' ? `%${value}%` :  compare_type === 'in' ? `(${value})` : `'${value}'`
        return `${table_field_name} ${compare_type} ${value}`
    } else {
        return ''
    }
}

module.exports = {
    buildClause
}