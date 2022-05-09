const jwt = require('jsonwebtoken')
const authCfg = require('../config/authCfg.json')


module.exports = function (req, res, next){
    const token = req.header('token') ? req.header('token') : req.params.userToken
    console.log("token dentro da MIDDLEWARE"+token)
    
    if (!token){ 
        
        return res.status(401).send('Acesso Negado: Não Autenticado')
    
    }else{
    
        jwt.verify(token, authCfg.secret,(err,decoded)=>{
            
            if(err){
                console.log("🚀 ~ file: auth.js ~ line 15 ~ jwt.verify ~ err", err)
                
                return res.send({error:'Token invalid'})
                
            }else if(req.params.userToken){
               
                if(decoded.id == req.params.userId){
                    return next()
                 }else{ return res.send({error:'Token Invalid'}) }   
                  
            }else{
                  console.log('decoded: '+decoded.id)
                  req.userId = decoded.id
                  return next()
            }
        })  
    }
}	