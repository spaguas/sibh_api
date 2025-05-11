const { pgWD } = require("../knex")

const getLightnings = async (bounds) =>{
    
    let query = pgWD.table('lightning_events')
    
    query.whereRaw(
        'latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?',
        [bounds[0], bounds[1], bounds[2], bounds[3]]
    );

    query.whereRaw("datetime >= now() - interval '1 hour'")
    query.whereRaw("quality_control_atd <= 1")

    query.orderByRaw('datetime desc')

    console.log(query.toSQL());
    

    return query
    
}

module.exports = {
    getLightnings
}