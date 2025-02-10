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

const buildJoin = (params, query) =>{
    // if(params.cod_ibge){                    
    query.join('cities', 'cities.id', 'hidroapp_statistics.model_id')
    query.join('stations', 'stations.id', 'station_prefixes.station_id')
    query.join('cities', 'cities.id', 'stations.city_id')
    // }
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
    buildWhere
}