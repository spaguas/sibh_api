const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'city_ids', 'city_decrees.city_id', 'in'))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}

module.exports = {
    buildWhere
}
