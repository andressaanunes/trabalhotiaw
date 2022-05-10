require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const prods = require('./controllers/produtos')
const auth = require('./middlewares/auth')
const isAdm = require('./middlewares/admin')
const users = require('./controllers/users')
const bcrypt = require('bcrypt')
const cors = require('cors')
const produtos = require('./controllers/produtos')


const PORT = process.env.PORT

const app = new express()


app.use(cors())

app.use('*',(req,res,next) => {
    res.header ("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
 next()
})



app.use('/admin/:userId/:userToken',auth,isAdm, express.static(path.join(__dirname, "adminContent","admin"))) 

app.use('/', express.static(path.join(__dirname, "public")))

/* app.get('/',(req, res) =>{
    res.redirect("https://www.crialuth.com/home/")
}) */



app.listen(PORT,(error)=>{
    console.log('Servidor na porta '+PORT)
    if (error) {
        console.log(error)
    }
})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}))

app.post('/newprod',isAdm, async function (req,res){

    try {
        let prods = req.body
        console.log(JSON.stringify(prods))
        produtos.newProduct(prods)
                
        res.status(200).send(prods)
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }
                 
})
app.post('/updateprod',isAdm, async function (req,res){

    try {
        let prods = req.body
        console.log(JSON.stringify(prods))
        produtos.updateProduct(prods)
                
        res.status(200).send(prods)

    } catch (error) {
        console.log(error)
        res.send(error)
        
    }
                    
})

app.delete('/delprod/:id',isAdm, async function (req,res){

    let prods = req.params.id
    console.log(prods)
    produtos.delProduct(prods)
            
    res.status(200).send(prods)
                    
    })        

app.get('/category/:category', async function getall(req,res){
    
    let categoria = req.params.category
    console.log(categoria)
    if (categoria === "maisvendidos"){ 
        
        let produtos = await prods.getMaisVendidos()
        res.json(produtos)
    }else{

        let produtos = await prods.getProductByCategory(categoria)
        res.json(produtos)
    }
    
    })


app.get('/search/:search', async function getall(req,res){

    let busca = req.params.search
    const produtos = await prods.searchProduct(busca)
   
    res.json(produtos)
         
})


app.get('/product',async(req,res)=>{
    console.log(req.query.id)
    const produtos = await prods.getProductById(req.query.id)
    res.status(200).json(produtos[0])
})


app.get('/all', async function getall(req,res){

    const produtos = await prods.getAllProducts()
    
    res.status(200)
    res.send(produtos)
     
        })

app.post('/cadastro', async (req, res) => {
        
        try{
            console.log(req.body)
            const user = await users.createUser(req.body)
            
            console.log("user"+user)
            
            if (user.error) {
    
                console.log("user.error:     " +  user.error)
                var error = {error: `Falha no cadastro: ${user.error}`}
                 
               
                res.status(400)
                res.send(error)
    
            } else {
                
                 
                res.header({token:users.generateToken({nome:user.nome})})
                res.send({user})
                
    
            }
    
        }catch(err){
            console.log(err)
             
            //res.status(400)
            res.send({error: `registration failed ${err}`})
        } 
    })

app.post('/login', async (req,res)=>{

    const user = await users.buscaEmail(req.body.email)
     
    if(user.error){
        res.status(400)
        res.send({error:'Endereço de Email não encontrado'})
    }else{
        
        if(await bcrypt.compare(req.body.password,user.dataValues.senha)){ 
         
            
            user.senha = user.isAdmin = user.createdAt = user.updatedAt = undefined
            
            res.header({token:users.generateToken({id:user.dataValues.id})})
            res.send({user})
        }else{
            console.log('passou aqui!')
            res.status(400)
            res.send({error:'Senha incorreta'})
        }
    }

}) 

app.post('/userId', async (req,res)=>{
    console.log('req.body.id:'+req.body.id)
    var user = await users.getUser(req.body.id)
     

   if(user.error){
        console.log('user.error')
        res.status(400)
        res.send({error:'usuario n�o encontrado'})
    
    }else if(user.isAdmin === 1){
        console.log('user isAdmin')
        
        res.status(200)
        res.send({"response":1})
    
    }else{
        console.log('user is not admin')
        res.status(401)
        res.send({error:'Acesso n�o autorizado, n�o possui permiss�es'})

    }
  }
)


module.exports = app	