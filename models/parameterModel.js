const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'parameterizable_type', 'parameters.parameterizable_type', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'parameter_type_ids', 'parameters.parameter_type_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'parameter_type_id', 'parameters.parameter_type_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'parameterizable_ids', 'parameters.parameterizable_id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'parameterizable_id', 'parameters.parameterizable_id', '='))) clauses.push(c);
    
    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}



module.exports = {
    buildWhere
}