
const express = require('express');
const { getMeasurements } = require('../config/database/new_measurements');
const { handleValidation: handleValidation } = require('../validation/newMeasurement/newMeasurementParamsValidation');
const { handleValidation: fromCityValidation } = require('../validation/newMeasurement/fromCityParamsValidation');
const { JSONtoCSV } = require('../helpers/csvHelper');
const router = express.Router();

router.get('/', async (req, res) => { 

    req.query.group_type = req.query.group_type || 'minute'
    req.query.format = req.query.format || 'json'

    let validation = await handleValidation(req.query)

    if(validation.error){
        res.status(400).send(validation.error)
        return false
    }

    let response = await getMeasurements(req.query)

    if(req.query.format === 'csv'){
        response = JSONtoCSV(response)
        res.header('Content-Type', 'text/csv');
        res.attachment('sibh-data.csv');
    } 

    res.send(response);
    
});

router.get('/from_city', async (req, res) => { 

    req.query.group_type = req.query.group_type || 'minute'
    req.query.format = req.query.format || 'json'

    let validation = await fromCityValidation(req.query)

    if(validation.error){
        res.status(400).send(validation.error)
        return false
    }

    let response = await getMeasurements(req.query)

    if(req.query.format === 'csv'){
        response = JSONtoCSV(response)
        res.header('Content-Type', 'text/csv');
        res.attachment('sibh-data.csv');
    } 

    res.send(response);
    
});

module.exports = router