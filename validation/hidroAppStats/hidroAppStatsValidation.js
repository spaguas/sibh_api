const Joi = require('joi');

const schema = Joi.object({
    date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    model_types: Joi.array().items(Joi.string().valid('City', 'Ugrhi', 'Subugrhi')).required(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().when('start_date', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }).greater(Joi.ref('start_date'))
}).custom((value, helpers)=>{
    const {start_date, end_date} = value
    const diffInDays = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);

    if (diffInDays > 366) {
        return helpers.error('custom.maxDays', { diffInDays });
    }

    return value
}).messages({
    'custom.maxDays': 'A diferença entre start_date e end_date não pode exceder 365 dias'
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