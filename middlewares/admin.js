const users = require('../controllers/users')

module.exports = async function(req,res,next){
    console.log(req)
    var userId = req.body ? req.body.userId : req.params.userId
    //console.log('userId'+userId)

    if (userId != undefined) {
    
        const userResult = await users.getUser(userId)
        //console.log('userResult'+JSON.stringify(userResult))
        if(userResult === undefined){

            return res.status(401).send('Acesso Negado: Não Autorizado')
            
        }
        else{
            return next()
        }

    }else{
        return res.status(401).send('<h2>Acesso Negado: Não Autorizado, Faça Login Primeiro!</h2>')
    }
    
    
}