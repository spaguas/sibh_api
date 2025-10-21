const {getCities} = require('../config/database/city_db')
const express = require('express');
const { getCityDecrees } = require('../config/database/decree_db');
const router = express.Router();

router.get('/cities', async (req, res) => {  
    let response  
    try{
        response = await getCityDecrees(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }
    
    res.send(response);
});

module.exports = router