const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {getUserByEmail, getUserRoles} = require('../config/database/user')
const {generateToken} = require('../services/authService')
const {authenticateToken} = require('../middlewares/authMiddleware');
const { loginValidation } = require('../validation/auth/authValidations');

router.post('/login',  async (req, res) => {    
    const { email, password } = req.body;

    let validation = await loginValidation({email, password})
    
    if(validation.error && validation.error.details.length > 0){        
        return res.status(400).json(validation.error)
    }

    let user
    try{
        user = await getUserByEmail(email)
    } catch(e){

    }

    if(!user){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }
    
    let compare = await bcrypt.compare(password, user.encrypted_password);
    
    if(!compare){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }

    user.roles = await getUserRoles(user.id)
    
    const token = generateToken(user,[])

    res.send({token, expiration: user.exp})
});

router.post('/me', authenticateToken, async (req, res) => {          
    const roles = await getUserRoles(req.user.id)
    const { id, ...rest } = req.user; 
    res.send({...rest, roles:roles.map(x=>x.name)})
});

module.exports = router
