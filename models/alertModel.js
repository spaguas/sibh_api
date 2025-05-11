const { buildClauseNew } = require("../helpers/generalHelper")

const buildWhere = (params, query) =>{

    let clauses = []

    //construindo cláusulas analisadoras dos parâmetros passados
    if ((c = buildClauseNew(params, 'alertable_type', 'alerts.alertable_type', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'alertable_id', 'alerts.alertable_id', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'flag', 'alerts.flag', '='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'start_date', 'alerts.date_hour', '>='))) clauses.push(c);
    if ((c = buildClauseNew(params, 'end_date', 'alerts.date_hour', '<='))) clauses.push(c);

    if(clauses.length > 0){
        const sql = clauses.map(c => c.clause).join(' AND ');
        const bindings = clauses.flatMap(c => c.bindings);

        query.whereRaw(sql, bindings);
        
    }
}



module.exports = {
    buildWhere
}