const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
})

const loginValidation = async (params) =>{
    let validation = loginSchema.validate(params, { abortEarly: false })

    return validation
}

module.exports = {
    loginValidation
}