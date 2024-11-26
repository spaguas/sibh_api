const express = require('express');
const { scanKey, writeKey, filterData } = require('../services/redisService');
const { getStations } = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {

    let data = await scanKey('prefix_*')
    let response
  
    if(data.length > 0){    
      data = filterData(data, req.query)
      res.send(data);
      return true
    } else {
      response = await getStations({})
  
      try {
      
        for(let i = 0; i< response.length; i++){
    
          let station = response[i]
          writeKey(`prefix_${station.id}`, station, 300)
    
        }
      } catch(e){
        console.log(e);
        
        res.status(500)
        return true
      }
    }
  
    try{
      data = filterData(response, req.query)
    } catch(e){
      console.log(e);
      res.status(500)
    }
    
    res.send(data);
    
  });

module.exports = router