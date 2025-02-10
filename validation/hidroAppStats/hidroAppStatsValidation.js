const Joi = require('joi');

const schema = Joi.object({
    date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    model_types: Joi.array().items(Joi.string().valid('City', 'Ugrhi')).required(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.forbidden()
    })
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