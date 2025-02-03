const { pgWD } = require("../knex")

const getLightnings = async (bounds) =>{
    
    let query = pgWD.table('lightning_events')
    
    query.whereRaw(`latitude between ${bounds[0]} and ${bounds[1]} and longitude between ${bounds[2]} and ${bounds[3]}`) //bounds pouco maior que o estado de SP
    query.whereRaw("datetime >= now() - interval '1 hour'")
    query.whereRaw("quality_control_atd <= 1")

    query.orderByRaw('datetime desc')

    console.log(query.toSQL());
    

    return query
    
}

module.exports = {
    getLightnings
}