const { getCities } = require("../config/database/city_db")
const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []
    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'date', 'hidroapp_statistics.date_hour', '='))
    whereRaw.push(buildClause(params,'start_date', 'hidroapp_statistics.date_hour', '>='))
    whereRaw.push(buildClause(params,'end_date', 'hidroapp_statistics.date_hour', '<='))
    whereRaw.push(buildClause(params,'model_types', 'hidroapp_statistics.model_type', 'in_str'))

    if(whereRaw && whereRaw.length > 0){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}

const buildWhereView = (params, query) =>{
    let whereRaw = []
    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'model_type', 'hidroapp_statistics_view.model_type', '='))
    whereRaw.push(buildClause(params,'model_id', 'hidroapp_statistics_view.model_id', '='))
    whereRaw.push(buildClause(params,'month', 'hidroapp_statistics_view.month', '='))

    if(whereRaw && whereRaw.length > 0){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
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