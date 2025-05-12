const Joi = require('joi');

const updateStatusSchema = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().min(1).max(4).required(),
})

const updateStatusValidation = async (params) =>{
    let validation = updateStatusSchema.validate(params, { abortEarly: false })

    return validation
}

module.exports = {
    updateStatusValidation
}