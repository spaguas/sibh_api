const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{
    let clauses = ["cod != '9999'"]
    clauses.push({ clause: 'cod != ?', bindings: ['9999'] });

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'cod', 'subugrhis.cod', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'cods', 'subugrhis.cod', 'in'))) clauses.push(c);
    if ((c = buildClauseNew(params, 'ids', 'subugrhis.id', 'in'))) clauses.push(c);


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