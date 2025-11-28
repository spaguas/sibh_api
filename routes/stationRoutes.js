const express = require('express');
const { scanKey, writeKey, filterData,scanList,writeList } = require('../services/redisService');
const { getStations,getStation, getStationRaw } = require('../config/database');
const { appendParametersOfStations,appendParametersOfStation } = require('../models/stationModel');
const { getParameters } = require('../config/database/parameter_db');
const { handleValidation: stationValidation} = require('../validation/station/stationParamValidation')
const {updateStationPrefixField} = require('../config/database/station_prefix_db')
const { authenticateToken, authorize, optionalAuthorize,optionalAuthenticateToken } = require('../middlewares/authMiddleware');
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
          writeKey(`prefix_${station.id}`, station, 600)
    
        }

        data = filterData(data, req.query)
        
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

//alterar o campo public de uma estação
router.patch('/:id/public', authenticateToken, authorize(['dev', 'admin']), async (req, res)=>{
  if(req.body?.public){

    //validnado parametros
    let {error} = await stationValidation({...req.params, ...req.body})
    if(error) return res.status(400).send(error)

    //buscando posto com id fornecido
    let data = await getStationRaw(req.params.id)
    if(!data) return res.status(404).send({error: 'Posto com id informado não encontrado'});
    
    //atuaizando status do posto
    try{
      let response = await updateStationPrefixField(req.params.id, {public: req.body.public, public_control:req.body.public_control})
      res.send(response)
    } catch(e){
      res.status(500).send({e:e, message:'Erro desconhecido ao atualizar status do posto'})
    }
    
  } else {
    res.status(500).send({error:'campo "public" obrigatório'})
  }
  
})

module.exports = router