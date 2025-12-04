const Joi = require('joi');

const updateStatusSchema = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().min(1).max(4).required(),
})

const updateStatusesSchema = Joi.object({
    measurement_ids: Joi.array().items(Joi.number().integer()).required(),
    status: Joi.number().min(1).max(4).required(),
})

const updateStatusValidation = async (params) =>{
    let validation = updateStatusSchema.validate(params, { abortEarly: false })

    return validation
}

const updateStatusesValidation = async (params) =>{
    let validation = updateStatusesSchema.validate(params, { abortEarly: false })

    return validation
}

module.exports = {
    updateStatusValidation,
    updateStatusesValidation
}