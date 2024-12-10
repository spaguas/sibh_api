const {pg} = require('../knex')
const serializer = require('../../serializers/serializer')
const {buildWhere} = require('../../models/alertModel')
const {handleValidation: getAlertValidation} = require('../../validation/alert/getAlertParamsValidation')
const {handleValidation: insertAlertValidation} = require('../../validation/alert/insertAlertParamsValidation')
const moment = require('moment')

const getAlerts = async (options = {}) =>{
    options.serializer = options.serializer || 'default'

    let validation = await getAlertValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    }    

    let fields = serializer.alert['default']

    let query = pg.table('alerts').select(fields)
    
    buildWhere(options, query)    

    return query
}

const insertAlert = async (options = {}) =>{
    console.log('Inserindo alerta', options)
    // options.date_hour = options.date_hour || new Date('2024-01-01 00:00')
    // options.alertable_type = options.alertable_type || 'StationPrefix'
    // options.alertable_id = options.alertable_id || 30917
    options.updated_at = options.updated_at || new Date()
    options.created_at = options.created_at || new Date()
    // options.whatsapp_send = options.whatsapp_send || new Date()

    let validation = await insertAlertValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return {message: validation.error, status: 400}
    }
    

    let query = pg.insert(options).into('alerts')

    try{
        await query;

        console.log('Alerta criado com sucesso')
        return {message: 'Alerta criado com sucesso', status:200}

    } catch (e){
        console.log('Erro ao criar alerta', e)
        return {message: 'Erro ao criar alerta', error: e.detail, status:500}
    }
}

module.exports = {getAlerts,insertAlert}