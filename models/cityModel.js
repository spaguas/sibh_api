const { buildClause, buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = []
    clauses.push({ clause: 'cod_ibge != ?', bindings: ['999999'] });

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'cod_ibge', 'cities.cod_ibge', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cod_ibges', 'cities.cod_ibge', 'in_str'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ids', 'cities.id', 'in'))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);

        console.log(query.toSQL());
        
    }
}



module.exports = {
    buildWhere
}