const { pgWD } = require("../knex")

const getLightnings = async () =>{
    
    let query = pgWD.table('lightning_events')
    
    // buildWhere(options, query)  
    
    query.whereRaw('latitude between -26.106681 and -18.890425 and longitude between -54.446606 and -41.525717') //bounds pouco maior que o estado de SP
    query.whereRaw("datetime >= now() - interval '2 hours'")

    query.orderByRaw('datetime desc')

    return query
    

}

module.exports = {
    getLightnings
}