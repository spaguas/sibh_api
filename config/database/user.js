const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const getUserByEmail = async (email) =>{

    let fields = serializer.user['default']

    let query = pg.table('users')

    query.select(fields)
    
    query.whereRaw(`email = '${email}'`).first()

    return query

}

module.exports = {
    getUserByEmail
}