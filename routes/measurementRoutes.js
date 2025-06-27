const express = require('express');
const { getMeasurements, getParameters } = require('../config/database');
const { scanList,writeList } = require('../services/redisService');
const { prepareToCSV } = require('../models/measurementModel');
const {handleValidation: nowValidation} = require('../validation/measurement/nowParamsValidation')
const {handleValidation: fromCityValidation} = require('../validation/measurement/fromCityParamsValidation')
const {handleValidation: measurementHandleValidation} = require('../validation/measurement/measurementParamsValidation');
const { getNowMeasurementsFlu, newMeasurementWD, updateMeasurementFields } = require('../config/database/measurements');
const { updateStatusValidation } = require('../validation/measurement/utilValidations');
const { authenticateToken, authorize, optionalAuthorize,optionalAuthenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', optionalAuthenticateToken, optionalAuthorize(['dev', 'admin']), async (req, res) => {
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
        let response = await getMeasurements({...options, authorized: req.user?.authorized})
        if(response.details){
            res.status(400)
        }
        let references

        if(options['format'] === 'csv'){
            let csv = prepareToCSV(response)
            // Define os cabeçalhos para download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="dados.csv"');
        
            // Envia o conteúdo
            res.send(csv);
        }

        if(options['parameter_type_ids']){
          references = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: options.station_prefix_ids, parameter_type_ids: options.parameter_type_ids})
        }
        res.send({measurements: response, references: references});
    } catch (e){
    res.status(500)
    }
});

router.get('/now_flu', async(req, res)=>{
    let options = req.query
    let data = []

    data = await getNowMeasurementsFlu(options)

    res.send({measurements: data});

})

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
    
    let url = `raining_now_${options.station_type_id === '1' ? `flu` : "plu"}_${options.hours}_${options.group_type}_${options.serializer}_${options.public || "false"}`
    
    let data = []

    if(!options.from_date){
        data = await scanList(url)
    }
    
    if(data.length == 0){         
        try{

            data = await getMeasurements(options)
            
            if(!options.from_date){
                writeList(url, data, 60)
            }
            
            
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

router.get('/from_city', async(req, res)=>{
    let options = req.query
    options.serializer = options.serializer || 'default' //default value
    options.group_type = options.group_type || 'all' //default value
    
    let validation = await fromCityValidation(options) //validando parâmetros
        
    if(validation.error && validation.error.details.length > 0){
        res.status(500)
        res.send(validation.error)
        return false
    }
    
    try{

        let response = await getMeasurements(options)
        if(response.details){
            res.status(400)
        }
        res.send({measurements: response});
        
        
    } catch(e){
        console.log(e);
        
        res.status(500)
    }
    return true
})

router.post('/new/webservice_data', async (req, res)=>{
    let data = await newMeasurementWD(req.body)
    res.send(data)
})

router.post('/:id/classification', authenticateToken, authorize(['admin', 'dev']), async (req, res)=>{

    let validation = await updateStatusValidation({id: req.params.id, ...req.body})
    
    if(validation.error && validation.error.details.length > 0){
        res.send(validation.error)
    } else {
        try{
            let data = await updateMeasurementFields(req.params.id, {measurement_classification_type_id: req.body.status})

            res.send(data)
        } catch(e){
            res.send({message: 'Erro ao alterar status da medição', e})
        }
        
    }
    
})

module.exports = router
