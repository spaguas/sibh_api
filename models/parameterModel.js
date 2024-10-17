const { buildClause } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let whereRaw = []

    //construindo cláusulas analisadoras dos parâmetros passados
    whereRaw.push(buildClause(params, 'parameterizable_type', 'parameters.parameterizable_type', '='))
    whereRaw.push(buildClause(params, 'parameter_type_ids', 'parameters.parameter_type_id', 'in'))
    whereRaw.push(buildClause(params, 'parameterizable_ids', 'parameters.parameterizable_id', 'in'))
    
    if(whereRaw){
        query.whereRaw(whereRaw.filter(x=>x).join(' and '))
    }
}



module.exports = {
    buildWhere
}