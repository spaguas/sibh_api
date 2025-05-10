const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = ["cod != '9999'"]

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'cod', 'subugrhis.cod', '='))
    whereRaw.push(buildClause(params,'cods', 'subugrhis.cod', 'in'))
    whereRaw.push(buildClause(params,'ids', 'subugrhis.id', 'in'))

    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}



module.exports = {
    buildWhere
}