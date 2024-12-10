const Joi = require('joi');

const schema = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    station_prefix_ids: Joi.array().required()
}).custom((value, helpers)=>{
    const {start_date, end_date} = value
    const diffInDays = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);

    if (diffInDays > 31) {
        return helpers.error('custom.maxDays', { diffInDays });
    }

    return value
}).messages({
    'custom.maxDays': 'A diferença entre start_date e end_date não pode exceder 31 dias'
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