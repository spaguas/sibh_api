const Joi = require('joi');

const schema = Joi.object({
    station_type_id: Joi.number().required(),
    serializer: Joi.string()
        .valid('very_short', 'short', 'default', 'complete') //validar os valores aceitos
        .required(),
    group_type: Joi.string().valid('minute', 'all').optional(),
    show_all: Joi.boolean().optional(),
    public: Joi.boolean().optional(),
    hours: Joi.number().required().custom((value, helpers) => {
        const { group_type, force } = helpers.state.ancestors[0]; // acessa os outros campos
        
        if (group_type === 'all' && force !== 'true' && value > 72) {
            return helpers.error('any.custom', { message: 'hours deve ser no máximo 72' });
        }

        if (group_type === 'all' && force === 'true' && value > 744) {
            return helpers.error('any.custom', { message: 'hours deve ser no máximo 744' });
        }

        if (group_type !== 'all' && value > 6) {
            return helpers.error('any.custom', { message: 'hours deve ser no máximo 6' });
        }

        return value;
    }),
    parameter_type_ids: Joi.when('station_type_id', {
        is: 1,
        then: Joi.array().items(Joi.number().valid(2)).optional(),
        otherwise: Joi.forbidden()
    }),
    from_date: Joi.date().optional(),
    force: Joi.boolean().optional()
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