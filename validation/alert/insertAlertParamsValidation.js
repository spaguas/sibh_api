const Joi = require('joi')
    .extend(require('@joi/date'));

const schema = Joi.object({
    alert_type_id: Joi.number().valid(1).required(),
    flag: Joi.string().optional(),
    date_hour: Joi.date().format('YYYY-MM-DD HH:mm').required(),
    alertable_type: Joi.string().required(),
    alertable_id: Joi.number().required(),
    options: Joi.object().optional(),
    whatsapp_send: Joi.date().format('YYYY-MM-DD HH:mm').optional(),
    email_send: Joi.date().format('YYYY-MM-DD HH:mm').optional(),
    created_at: Joi.date().format('YYYY-MM-DD HH:mm').required(),
    updated_at: Joi.date().format('YYYY-MM-DD HH:mm').required()
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