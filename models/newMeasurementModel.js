const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'start_date', 'new_measurements.date_hour', '>='))
    whereRaw.push(buildClause(params,'end_date', 'new_measurements.date_hour', '<='))
    whereRaw.push(buildClause(params,'station_prefix_ids', 'new_measurements.station_prefix_id', 'in'))

    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}



module.exports = {
    buildWhere
}