const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number().integer().positive(),
    public: Joi.boolean(),
    public_control: Joi.date().iso()
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