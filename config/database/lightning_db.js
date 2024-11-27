const { pgWD } = require("../knex")

const getLightnings = async () =>{
    
    let query = pgWD.table('lightning_events').limit(100).orderByRaw('datetime desc')
    
    // buildWhere(options, query)    

    return query
    

}

module.exports = {
    getLightnings
}