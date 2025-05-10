const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = ["cod_ibge != '999999'"]

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params,'cod_ibge', 'cities.cod_ibge', '='))
    whereRaw.push(buildClause(params,'cod_ibges', 'cities.cod_ibge', 'in_str'))
    whereRaw.push(buildClause(params,'ids', 'cities.id', 'in'))

    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}



module.exports = {
    buildWhere
}