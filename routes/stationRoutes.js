const express = require('express');
const { scanKey, writeKey, filterData,scanList,writeList } = require('../services/redisService');
const { getStations,getStation } = require('../config/database');
const { appendParametersOfStations,appendParametersOfStation } = require('../models/stationModel');
const { getParameters } = require('../config/database/parameter_db');
const router = express.Router();

router.get('/', async (req, res) => {

    let data = await scanKey('prefix_*')
  
    if(data.length > 0){    
      data = filterData(data, req.query)
    } else {
      data = await getStations({serializer: 'complete'})
  
      try {
      
        for(let i = 0; i< data.length; i++){
    
          let station = data[i]
          writeKey(`prefix_${station.id}`, station, 300)
    
        }
      } catch(e){
        console.log(e);
        
        res.status(500)
        return true
      }
    }

    if(req.query.parameter_type_ids?.length > 0){
      let references = await scanList(`station_prefix_references_${req.query.parameter_type_ids}`)
        
      if(references?.length == 0){
          console.log('não tem, buscando referencias');
          
          references = await getParameters({parameterizable_type: 'StationPrefix', parameter_type_ids: req.query.parameter_type_ids})

          writeList(`station_prefix_references_${req.query.parameter_type_ids}`, references, 300)
      }

      data.map(x=>x.references = references.filter(y=>y.parameterizable_id === x.id))
    }
    
    res.send(data);
    return true
    
});

router.get('/:id', async (req, res)=>{
  data = await getStation(req.params.id)

  data = await appendParametersOfStation(data, req.params.id)

  res.send(data)
})

module.exports = router