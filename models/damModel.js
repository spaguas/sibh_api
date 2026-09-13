const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'id', 'dams.id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ids', 'dams.id', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cod', 'dams.cod', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'name', 'dams.name', 'like'))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);

    }
}

module.exports = {
    buildWhere
}
