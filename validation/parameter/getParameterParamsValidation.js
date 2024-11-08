const Joi = require('joi');

const schema = Joi.object({
    serializer: Joi.string().required(),
    parameter_type_id: Joi.number().optional(),
    parameter_type_ids: Joi.array().optional(),
    parameterizable_type: Joi.string().optional(),
    parameterizable_id: Joi.number().optional(),
    parameterizable_ids: Joi.array().optional()
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