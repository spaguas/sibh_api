const Joi = require('joi');

const schema = Joi.object({
    station_type_id: Joi.number().optional(),
    serializer: Joi.string()
        .valid('very_short', 'short', 'default', 'complete') //validar os valores aceitos
        .required(),
    group_type: Joi.string().valid('minute', 'all').optional(),
    public: Joi.boolean().optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).greater(Joi.ref('start_date')),
    cod_ibge: Joi.string().required(),
    station_owner_ids: Joi.array().optional()
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