const Joi = require('joi');

const schema = Joi.object({
    station_type_id: Joi.number().required(),
    serializer: Joi.string()
        .valid('very_short', 'short', 'default', 'complete') //validar os valores aceitos
        .required(),
    group_type: Joi.string().valid('minute', 'all').optional(),
    show_all: Joi.boolean().optional(),
    public: Joi.boolean().optional(),
    hours: Joi.required().when('group_type', {
        is: 'all',
        then: Joi.number().max(72),
        otherwise: Joi.number().max(6)
    }),
    parameter_type_ids: Joi.when('station_type_id', {
        is: 1,
        then: Joi.array().items(Joi.number().valid(2)).optional(),
        otherwise: Joi.forbidden()
    }),
    from_date: Joi.date().optional()
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