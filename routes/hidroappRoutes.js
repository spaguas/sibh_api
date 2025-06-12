const {getHidroAppData,getHidroAppViewData} = require('../config/database/hidroapp_db')
const express = require('express');
const router = express.Router();
const { encode, decode } = require('@msgpack/msgpack');

router.get('/', async (req, res) => {  
    let response  
    try{
        response = await getHidroAppData(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }

    if(req.query.msgpack){
        const buffer = encode(response);

        res.setHeader('Content-Type', 'application/msgpack');
        res.send(buffer);
        // res.send(decode(buffer));
    } else {
        res.send(response);
    }
    
});

router.get('/view', async (req, res) => {  
    let response  
    try{
        response = await getHidroAppViewData(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }
    
    res.send(response);
});

module.exports = router