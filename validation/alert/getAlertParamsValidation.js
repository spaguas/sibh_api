const Joi = require('joi')
    .extend(require('@joi/date'));

const schema = Joi.object({
    flag: Joi.string().optional(),
    start_date: Joi.date().format('YYYY-MM-DD HH:mm').optional(),
    end_date:Joi.date().format('YYYY-MM-DD HH:mm').when('start_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).greater(Joi.ref('start_date')),    
    serializer: Joi.string().required(),
    alertable_type: Joi.string().optional(),
    alertable_id: Joi.string().optional(),
    alert_type_id: Joi.number().valid(1).optional(),
})

const handleValidation = async (params) =>{
    let validation = await validate(params)

    return validation
}

const validate = async params =>{
    return schema.validate(params, { abortEarly: false })
}

module.exports = {
    schema,
    handleValidation
}