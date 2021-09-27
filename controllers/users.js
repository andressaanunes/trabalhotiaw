const db = require('../model/Db')
const users =  db.Sequelize.Op
const usuarios = require('../model/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authCfg = require('../config/authCfg.json')

async function cripting (req){
    
    let hash = await bcrypt.hash(req,10)
    return hash
}

async function createUser(user){
    console.log('user: '+ JSON.stringify(user))

    try{
         const check = await checkUser(user)
        console.log("controller user:"+ JSON.stringify(check))
            
        if(check.error){
                
                console.log("check.erro:"+JSON.stringify(check))
                return JSON.stringify(check)

        }else{
                    
                user.senha = await cripting(user.senha)

                try{
                        
                    await usuarios.create(user)
                        
                    return user

                }catch(err){

                     return(`Usuário (${user.nome}) não pode ser criado:` +err)
                
                }

            } 

        }catch(err){
            console.log('erro no cadastro')
            console.log(err)
            return JSON.stringify({error: "erro no cadastro"}) 
        }    

}

async function checkUser(user){

    try{
        const emailCheck = await usuarios.findAll({
            where: {
                email: user.email
                }
            })
        const nameCheck = await usuarios.findAll({
            where: {
                nome: user.nome
                }
            })
        if(emailCheck){
            const result = {error:"Esse Email já foi cadastrado!"}
            console.log('emailcheck:' +result)
            return result
        
        }else if(nameCheck){
            const resultado = {error:"Esse Nome já foi cadastrado!"}
            console.log('namecheck:'+ resultado)
            return resultado

        }else{
            return true
        }
    }catch(err){console.log(err)}
}



async function buscaEmail(user){
    try{
    const result = await usuarios.findAll({
        where:{
            email:user
        }
    })
    return result[0]
    }catch(err){
        console.error('Erro em buscaEmail'+err)
        return err
    }
    
}

function generateToken(params = {}){
    return jwt.sign(params,authCfg.secret,{expiresIn:86400})
}


module.exports = {
    generateToken:generateToken,
    createUser: createUser,
    buscaEmail:buscaEmail
}