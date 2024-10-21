const Joi = require('joi');

const schema = Joi.object({
    cod_ibge: Joi.string(),
    parameter_type_ids: Joi.array()
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