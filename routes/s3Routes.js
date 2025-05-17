const {getParameters} = require('../config/database')
const express = require('express');
const { getRadarLastImages,getImage } = require('../services/s3Service');
const router = express.Router();

router.get('/radar/pnova/last_images', async (req, res) => {  
    res.json(await getRadarLastImages(req.query));
    
});

router.get('/image', async (req, res) => {  
    let image
    try{
        image = await getImage(req.query.key);
        res.setHeader('Content-Type', image.ContentType || 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        // Pipe da imagem para a resposta
        image.Body.pipe(res);
    } catch(e){
        res.status(404).send('Imagem nao encontrada')
    }  

    
    
});


module.exports = router