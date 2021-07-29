const jwt = require('jsonwebtoken')
const authCfg = require('../config/authCfg.json')


module.exports = function (req, res, next){
    const token = req.header('token')
    if (!token){ 
        
        return res.status(401).send('Acesso Negado: Não Autenticado')
    }
    
    jwt.verify(token, authCfg.secret,(err,decoded)=>{
        if(err){
            
            return res.send({error:'Token invalid'})
            
        }

        req.userId = decoded.id
        return next()
    })
}