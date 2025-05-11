const { getCities } = require("../config/database/city_db")
const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'date', 'hidroapp_statistics.date_hour', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'start_date', 'hidroapp_statistics.date_hour', '>='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'end_date', 'hidroapp_statistics.date_hour', '<='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'model_types', 'hidroapp_statistics.model_type', 'in_str'))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

const buildWhereView = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'model_type', 'hidroapp_statistics_view.model_type', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'model_id', 'hidroapp_statistics_view.model_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'month', 'hidroapp_statistics_view.month', '='))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

const getAdditionalObjects =  async (query) =>{
    let obj = {}
    
    query.map(x=> obj[x.model_type] ? obj[x.model_type].push(x.model_id) : obj[x.model_type] = [x.model_id])

    let result = {}

    for(let key in obj){
        // let query
        if(key === 'City'){
            cities = await getCities({ids: obj[key]})

            result[key] = cities
            
        }
    }
    
    return result
}



module.exports = {
    getAdditionalObjects,
    buildWhere,
    buildWhereView
}