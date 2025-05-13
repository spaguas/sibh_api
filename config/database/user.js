const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")

const getUserByEmail = async (email) =>{

    let fields = serializer.user['default']

    let query = pg.table('users')

    query.select(fields)
    
    query.whereRaw('email = ?', [email]).first();

    return query

}

const getUserRoles = async (user_id) =>{

    let query = pg.table('users_roles')

    query.join('roles', 'roles.id', 'users_roles.role_id')

    query.select('roles.id',  'roles.name')

    query.whereRaw('users_roles.user_id = ?',[user_id])

    return query

}

module.exports = {
    getUserByEmail,
    getUserRoles
}