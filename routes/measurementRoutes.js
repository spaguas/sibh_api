const express = require('express');
const { getMeasurements, getParameters } = require('../config/database');
const { scanKey, writeKey } = require('../servives/redisService');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        let response = await getMeasurements(req.query)
        if(response.details){
            res.status(400)
        }
        let references
        if(req.query['parameter_type_ids']){
          references = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: req.query.station_prefix_ids, parameter_type_ids: req.query.parameter_type_ids})
        }
        res.send({measurements: response, references: references});
    } catch (e){
    res.status(500)
    }
});

router.get('/now', async(req, res)=>{
    let url = 'now?' + JSON.stringify(req.query)
    let data = await scanKey(url)

    if(data.length > 0){       
        
        res.status(200)
        res.send(Object.values(data))
    } else {
        console.log('nao tenho');
        try{
            let response = await getMeasurements(req.query)

            writeKey(url, response, 60)

            res.status(200)
            res.send(response)
        } catch(e){
            res.status(500)
        }
        
    }

    return true
})

module.exports = router
