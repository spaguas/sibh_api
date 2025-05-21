const {getParameters} = require('../config/database')
const express = require('express');
const { getRadarLastImages,getImage } = require('../services/s3Service');
const { lastImagesValidation } = require('../validation/s3/utilValidations');
const router = express.Router();

router.get('/radar/last_images', async (req, res) => {
    let validation = await lastImagesValidation(req.query)
    
    if(validation.error && validation.error.details.length > 0){
        res.status(400).send(validation.error)
        return;
    }

    try{
        let data = await getRadarLastImages(req.query)
        res.json(data);
    } catch(e){
        console.error('Erro ao consultar imagens:', e);
        res.status(400).json({error:'Erro ao consultar imagens'})
        return;
    }    
    
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