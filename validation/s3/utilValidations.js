const Joi = require('joi');

const lastImagesSchema = Joi.object({
    hours: Joi.number().min(1).max(72).required(),
    radar_name: Joi.string().required().valid('pnova')
})

const lastImagesValidation = async (params) =>{
    let validation = lastImagesSchema.validate(params, { abortEarly: false })

    return validation
}

module.exports = {
    lastImagesValidation
}