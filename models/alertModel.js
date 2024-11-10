const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'alertable_type', 'alerts.alertable_type', '='))
    whereRaw.push(buildClause(params,'alertable_id', 'alerts.alertable_id', '='))
    whereRaw.push(buildClause(params,'flag', 'alerts.flag', '='))
    whereRaw.push(buildClause(params,'start_date', 'alerts.date_hour', '>='))
    whereRaw.push(buildClause(params,'end_date', 'alerts.date_hour', '<='))

    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}



module.exports = {
    buildWhere
}