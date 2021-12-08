const users = require('../controllers/users')

module.exports = async function(req,res,next){

    const userId = req.body.userId
    console.log(userId)
    if (userId) {
    
        const userResult = users.getUser(userId)
        if(userResult.isAdmin === 1){
            return next()
        }
        else{
            return res.status(401).send('Acesso Negado: Não Autorizado')
        }

    }else{
        return res.status(401).send('<h2>Acesso Negado: Não Autorizado, Faça Login Primeiro!</h2>')
    }
    
    
}