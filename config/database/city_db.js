const serializer = require("../../serializers/serializer")
const { pg } = require("../knex")
const { handleValidation: cityHandleValidation} = require('../../validation/city/cityParamsValidation')
const { buildWhere: buildCityWhere} = require('../../models/cityModel')
const { getParameters} = require('../database')

const getCities = async (options = {}) =>{
    let serializer_name = 'very_short'
    let fields = serializer.city[serializer_name]

    let validation = await cityHandleValidation(options)

    if(validation.error && validation.error.details.length > 0){
        return validation.error
    } 
    
    if(options.with_bbox){
        fields = [...fields, 'bbox_json']
    }

    let query = pg.table('cities').select(fields)
    
    // buildMeasurementJoin(serializer_name, query)

    buildCityWhere(options, query)
    
    query = await query //executando ela

    if(options.parameter_type_ids && options.parameter_type_ids.length > 0){   
        
        let parameters = await getParameters({parameterizable_type: 'City', parameterizable_ids: query.map(x=>x.id), parameter_type_ids: options.parameter_type_ids})
        
        query.map(city=>city.parameters = parameters.filter(x=> x.parameterizable_type === 'City' && x.parameterizable_id === city.id))
    }

    
    

    return query

}

const getCityUgrhis = async (options = {}) =>{

    let fields = ['city_cod', 'city_name', 'city_id', pg.raw("STRING_AGG(ugrhi_cod::text,', ')")]

    let query = pg.table('maps.city_ugrhis').select(fields).whereRaw('area_km2 > 3').groupByRaw('city_cod, city_id,city_name')  

    query = await query

    if(options.parameter_type_ids && options.parameter_type_ids.length > 0){   
        
        let parameters = await getParameters({parameterizable_type: 'City', parameter_type_ids: options.parameter_type_ids})
        
        query.map(city=> city.parameters = parameters.filter(x=> x.parameterizable_type === 'City' && x.parameterizable_id === city.city_id ))
    }

    return query
}

module.exports = {
    getCities,
    getCityUgrhis
}