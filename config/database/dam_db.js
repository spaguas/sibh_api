const {pg} = require('../knex')
const serializer = require('../../serializers/serializer')
const {buildWhere} = require('../../models/damModel')
const {handleValidation: getDamValidation} = require('../../validation/dam/getDamParamsValidation')
const {handleValidation: insertDamEventValidation} = require('../../validation/dam/insertDamEventParamsValidation')

const getDams = async (options = {}) =>{
    options.serializer = options.serializer || 'default'

    let validation = await getDamValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }

    let fields = serializer.dam[options.serializer]

    let query = pg.table('dams').select(fields)

    buildWhere(options, query)

    return query
}

const insertDamEvent = async (options = {}, user_id) =>{
    console.log('Inserindo evento de barragem', options)
    options.eventable_type = 'Dam'
    options.user_id = user_id
    options.updated_at = options.updated_at || new Date()
    options.created_at = options.created_at || new Date()

    let validation = await insertDamEventValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return {message: validation.error, status: 400}
    }

    let query = pg.insert(options).into('events')

    try{
        await query;

        console.log('Evento de barragem criado com sucesso')
        return {message: 'Evento de barragem criado com sucesso', status: 200}

    } catch (e){
        console.log('Erro ao criar evento de barragem', e)
        return {message: 'Erro ao criar evento de barragem', error: e.detail, status: 500}
    }
}

module.exports = {getDams, insertDamEvent}
