const Joi = require('joi')

const schema = Joi.object({
    eventable_id: Joi.number().required(),
    eventable_type: Joi.string().valid('Dam').default('Dam'),
    event_type_id: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().allow(null),
    desc: Joi.string().optional().allow(null, ''),
    options: Joi.object().required(),
    user_id: Joi.number().optional().allow(null),
    created_at: Joi.date().required(),
    updated_at: Joi.date().required()
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
