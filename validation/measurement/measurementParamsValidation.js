const Joi = require('joi');
const moment = require('moment')

const schema = Joi.object({
    station_prefix_ids: Joi.array()
        .max(10),
    serializer: Joi.string()
        .valid('very_short', 'short', 'default') //validar os valores aceitos
        .required(),
    station_type_id: Joi.when('serializer', {
        is: Joi.valid('short','default'), //validando se o serializer vai ter o campo station_type
        then: Joi.number().min(1).optional(),
        otherwise: Joi.forbidden().messages({
            'any.unknown': 'ignorar field e erro' //erro custom para capturar
        })
    }),
    start_date: Joi.date().required(),
    // end_date: Joi.when('start_date', {
    //     is: Joi.date(), 
    //     then: Joi.date().greater(Joi.ref('start_date')).required()
    // }),
    end_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).greater(Joi.ref('start_date')).required(),
    group_type: Joi.string()
            .valid('minute', 'hour', 'day', 'month', 'year', 'all')
            .required(),
    parameter_type_ids: Joi.array().optional(),
    hours: Joi.number().optional().max(31*24)
})
.or('station_prefix_ids') //preciso de 1 desses parâmetros
.oxor('start_date', 'hours') //preciso de apenas um desses parâmetros(OBVIAMENTE deixei aqui pra lembrar de como usar em outros casos)
.custom((value, helpers) =>{ // validar a diff entre as datas
    const {start_date, end_date} = value
    const diffTime = Math.abs(new Date(end_date) - new Date(start_date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
    const MAX_DIFF = getMaxDiff(helpers)

    if (diffDays > MAX_DIFF) {
        return helpers.error('date.diff', {MAX_DIFF});
    }

    return value
}, 'Validação período').messages({ //criando novo tipo de erro 'date.diff'
    'date.diff': 'A diferença entre data de início e fim deve ser menor ou igual a {#MAX_DIFF} dias.'
})

const handleValidation = async (params) =>{
    let validation = await validate(params)
    
    if(validation.error){
        let removeOnes = validation.error.details.filter(x=>x.message === 'ignorar field e erro' || x.type === 'object.unknown')
        removeOnes.map(x=>{
            delete params[x.path]
        })        
        validation.error.details = validation.error.details.filter(x=>x.message !== 'ignorar field e erro' && x.type !== 'object.unknown')
    }
    return validation
}

const validate = async params =>{
    return schema.validate(params, { abortEarly: false })
}

const getMaxDiff = data =>{
    
    let group_type_days = {minute: 31, hour: 60, day: 365, month: 365*5}
    
    let {group_type} = data.original
    
    return [group_type_days[group_type]].reduce((p,c)=> c < p ? c : p)
    
}

module.exports = {
    schema,
    handleValidation
}