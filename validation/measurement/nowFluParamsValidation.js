const Joi = require('joi');

const schema = Joi.object({
    references: Joi.array().items(Joi.string().valid('q95', 'q710', 'avg_flow', 'attention', 'alert', 'emergency', 'extravasation', 'l95', 'l_series_size'))
        .optional(),
    with_all_ref: Joi.boolean().optional(),
    with_one_ref: Joi.boolean().optional()
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