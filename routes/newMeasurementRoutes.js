
const express = require('express');
const { getMeasurements } = require('../config/database/new_measurements');
const { handleValidation: handleValidation } = require('../validation/newMeasurement/newMeasurementParamsValidation')
const router = express.Router();

router.get('/', async (req, res) => { 

    let validation = await handleValidation(req.query)

    if(validation.error){
        res.status(400).send(validation.error)
        return false
    }

    let response = await getMeasurements(req.query)

    res.send(response);
});

module.exports = router