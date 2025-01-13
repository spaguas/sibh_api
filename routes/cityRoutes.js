const {getCities,getCityUgrhis} = require('../config/database/city_db')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {  
    let response  
    try{
        response = await getCities(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }
    
    res.send(response);
});

router.get('/with_ugrhis', async (req, res) => {  
    let response  
    try{
        response = await getCityUgrhis(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }
    
    res.send(response);
});

module.exports = router