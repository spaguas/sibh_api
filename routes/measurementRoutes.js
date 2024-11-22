const express = require('express');
const { getMeasurements, getParameters } = require('../config/database');
const { scanList,writeList } = require('../servives/redisService');
const { filterRainingNowData } = require('../models/measurementModel');
const {handleValidation: nowValidation} = require('../validation/measurement/nowParamsValidation')
const {handleValidation: measurementHandleValidation} = require('../validation/measurement/measurementParamsValidation')
const router = express.Router();

router.get('/', async (req, res) => {
    let options = req.query
    options.serializer = options.serializer || 'default' //default value
    options.group_type = options.group_type || 'minute' //default value
    
    let validation = await measurementHandleValidation(options)

    if(validation.error && validation.error.details.length > 0){
        res.status(400)
        res.send(validation.error)
        return false
    } 

    try{
        let response = await getMeasurements(options)
        if(response.details){
            res.status(400)
        }
        let references
        if(options['parameter_type_ids']){
          references = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: options.station_prefix_ids, parameter_type_ids: options.parameter_type_ids})
        }1
        res.send({measurements: response, references: references});
    } catch (e){
    res.status(500)
    }
});

router.get('/now', async(req, res)=>{
    let options = req.query
    options.serializer = options.serializer || 'default' //default value
    options.group_type = options.group_type || 'all' //default value
    
    let validation = await nowValidation(options) //validando parâmetros
        
    if(validation.error && validation.error.details.length > 0){
        res.status(500)
        res.send(validation.error)
        return false
    }  
    
    let url = `raining_now_${options.station_type_id === '1' ? `flu` : "plu"}_${options.hours}_${options.group_type}`
    
    let data = await scanList(url)
    
    if(data.length == 0){         
        try{

            data = await getMeasurements(options)
            
            writeList(url, data, 60)
            
        } catch(e){
            console.log(e);
            
            res.status(500)
        }
    }

    // data = filterRainingNowData(data, req.query)

    console.log(url, data.length);

    let references
    if(options.parameter_type_ids && options.parameter_type_ids.length > 0){
        references = await scanList(`station_prefix_references_${options.parameter_type_ids}`)
        
        if(!references || references.length == 0){
            console.log('não tem, buscando referencias');
            
            references = await getParameters({parameterizable_type: 'StationPrefix', parameter_type_ids: options.parameter_type_ids})

            writeList(`station_prefix_references_${options.parameter_type_ids}`, references, 60)
        }
    }

    res.status(200)
    res.send({measurements: data, references: references && references.length > 0 ? references : {}})

    return true
})

module.exports = router
