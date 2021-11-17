const jwt = require('jsonwebtoken')
const authCfg = require('../config/authCfg.json')


module.exports = function (req, res, next){
    const token = req.header('token')
    console.log(token)
    
    if (!token){ 
        
        return res.status(401).send('Acesso Negado: Não Autenticado')
    
    }else{
    
        jwt.verify(token, authCfg.secret,(err,decoded)=>{
            
            if(err){
                console.log("🚀 ~ file: auth.js ~ line 15 ~ jwt.verify ~ err", err)
                
                return res.send({error:'Token invalid'})
                
            }else{
            console.log(decoded)
            req.userId = decoded.id
            return next()
            }
        })  
    }
}