const Joi = require('joi');

const schema = Joi.object({
    cod_ibge: Joi.string(),
    cod_ibges: Joi.array(),
    parameter_type_ids: Joi.array(),
    ids: Joi.array(),
    with_bbox: Joi.boolean().optional()
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