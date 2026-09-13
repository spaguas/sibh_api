const Joi = require('joi')

const schema = Joi.object({
    id: Joi.number().optional(),
    ids: Joi.array().items(Joi.number()).single().optional(),
    cod: Joi.string().optional(),
    name: Joi.string().optional(),
    serializer: Joi.string().optional()
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
