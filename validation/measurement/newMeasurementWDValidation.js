const Joi = require('joi');

const schema = Joi.object({
    prefix: Joi.string().required(),
    datetime: Joi.date().required(),
    station_owner: Joi.string().required(),
    rainfall: Joi.number().min(0).optional(),
    rainfall_acum: Joi.number().min(0).optional(),
    level: Joi.number().optional(),
    battery_level: Joi.number().optional(),
    tempeture: Joi.number().optional(),
    wind: Joi.number().optional(),
    pressure: Joi.number().optional(),
    radiation: Joi.number().optional(),
    air_tempeture: Joi.number().optional(),
    humudity: Joi.number().optional(),
    height: Joi.number().optional(),
    discharge: Joi.number().optional(),
    offset_level: Joi.number().optional()
}).or('rainfall', 'rainfall_acum', 'level', 'battery', 'tempeture', 'wind', 'pressure', 'radiation', 'air_tempeture', 'radiation', 'humidity', 'discharge', 'offset_level')

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