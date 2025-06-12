const {getHidroAppData,getHidroAppViewData} = require('../config/database/hidroapp_db')
const express = require('express');
const router = express.Router();
const { encode, decode } = require('@msgpack/msgpack');
const zlib = require('zlib');

router.get('/', async (req, res) => {  
    let response  
    try{
        response = await getHidroAppData(req.query)
    } catch(e){
        console.log(e);
        
        res.status(500)
    }

    if(req.query.msgpack){
        const encoded = encode(response);
        const buffer = Buffer.from(encoded);
        zlib.gzip(buffer, (err, compressed) => {
            if (err) return res.status(500).end();

            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'application/msgpack');
            res.setHeader('Content-Length', compressed.length);
            res.send(compressed);
        });
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