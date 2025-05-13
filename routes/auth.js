const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {getUserByEmail, getUserRoles} = require('../config/database/user')
const {generateToken} = require('../services/authService')
const {authenticateToken} = require('../middlewares/authMiddleware')

router.post('/login',  async (req, res) => {    
    const { email, password } = req.body;

    let user = await getUserByEmail(email)

    if(!user){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }
    
    let compare = await bcrypt.compare(password, user.encrypted_password);
    
    if(!compare){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }

    const roles = await getUserRoles(user.id)
    const token = generateToken(user,roles.map(x=>x.name))

    console.log(token,roles);

    res.send({token,roles: roles.map(x=>x.name)})
});

router.post('/test', authenticateToken, async (req, res) => {    
    res.send(req.user)
});

module.exports = router
