const Joi = require('joi');

const schema = Joi.object({
    model: Joi.string().required(),
    parameter_type_id: Joi.number().required(),
    values: Joi.object

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