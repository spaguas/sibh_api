const Joi = require('joi');

const schema = Joi.object({
    model_type: Joi.string().valid('City', 'Ugrhi', 'Subugrhi', 'Otto').required(),
    model_id: Joi.number().optional(),
    month: Joi.number().optional(),
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