require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const prods = require('./controllers/produtos')
const auth = require('./middlewares/auth')
//const apiRoute = require('./routes/api')
const shipping = require('./controllers/melhorenvio')
const cors = require('cors')
const PORT = process.env.PORT

const app = new express()


app.use(cors())

//app.use('/api',apiRoute)

app.use('*',(req,res,next) => {
    res.header ("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    /* if(req.headers['x-forwarded-proto']=='https'){
        next()

    }else if(req.originalUrl == "/"){
        res.redirect("https://"+req.headers.host + req.originalUrl+"home/")

    } else{
        res.redirect("https://"+req.headers.host + req.originalUrl)
    } 
 */next()
    })



app.use('/', express.static(path.join(__dirname, "public")))

app.get('/',(req, res) =>{
    res.redirect("https://www.crialuth.com/home/")
})

app.get('/all', async function getall(req,res){

    const produtos = await prods.getAllProducts()
    
    res.status(200)
    res.send(produtos)
     
        })



app.listen(PORT,(error)=>{
    console.log('Servidor na porta '+PORT)
    if (error) {
        console.log(error)
    }
})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}))


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


app.get('/product/:id', async function getall(req,res){

    let busca = req.params.id
    const produtos = await prods.getProductById(busca)
    
    res.json(produtos)
         
    })

app.get('/area/:area', async function getall(req,res){

    let busca = req.params.area
    
    switch(busca) {
        case "gourmet":
          
          const prods1 = await prods.getProductBolotas(
              [107,23,46,35,36,340,24,23,19,59,52,56,58,341]
        )
          
          res.json(prods1)
          break
          
        case "cozinha":
          
          const prods2 = await prods.getProductBolotas(
              [146,107,43,109,56]
        )
          
          res.json(prods2)
          break
          
        case "escritorio":
            
          const prods3 = await prods.getProductBolotas(
              [106,161,88,34,85,45,87,123,48,53,149,40,144,51,84,77,15,117,37,91,38,55,82,57,39,136,137,138,341,342,343,344,345,346,347,348,349,350,351]
        )
          
          res.json(prods3)
          break
          

        case "quarto":
            
          const prods4 = await prods.getProductBolotas(
              [44,11,68,71,4,139,93,90,124,102,92,97,95,144,70,119,10,80,54,12,21,14,89,81,72,165,75,98,153,16,100,339]
        )
          
          res.json(prods4)
          break
            
        case "sala":
            
          const prods5 = await prods.getProductBolotas(
              [88,34,85,118,116,50,45,17,47,149,40,102,99,84,77,15,78,79,80,117,103,91,108,82,83,110]
        )
          
          res.json(prods5)
          break
          
      }
                 
})

app.post('/product/newprod', async function getall(req,res){

    let prods = req.body
    console.log(prods)
    
            
    res.send(prods)
                 
        })

app.get('/all', async function getall(req,res){

    const produtos = await prods.getAllProducts()
    
    res.status(200)
    res.send(produtos)
     
        })

app.post('/cadastro', async(req,res)=>{
    try{
        const user = await users.createUser(req.body)
       
        var createUser = JSON.parse(user)
        
        if (createUser.error) {

            console.log("user.error:     " +  createUser.error)
            var error = JSON.stringify({error: `Falha no cadastro: ${createUser.error}`})
           
            res.status(400)
            res.send(error)

        } else {

            res.header({token:users.generateToken({id:user.id})}) 
            res.send({user})

        }  

    }catch(err){
        console.log(err)
        res.status(400).send(JSON.stringify({error: `registration failed ${err}`}))
    }
})

app.post('/login', async (req,res)=>{
    
    const user = await users.buscaEmail(req.body.email)
    if(!user){
        res.status(400).send({error:'Endereço de Email não encontrado'})
    }
    if(await bcrypt.compare(req.body.password,user.senha)){
        user.senha = undefined
        res.header({token:users.generateToken({id:user.id})})
        res.send({user})
    }else{
        res.status(400).send({error:'Senha incorreta'})
    }
})


app.post('/checkout', auth, async (req,res) => {
    console.log('TEM QUE ATIVAR MIDDL  DE AUTENTICAÇÃO PRA COLOCAR EM PRODUÇÃO')
    try{
        var searchParams = new URLSearchParams(req.body)
        var bodyForm = searchParams.toString()
        
        var reqOptions = {
        method:'POST', 
        header: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data:bodyForm
        }
    
        var code = await axios('https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=matheuscabralu1990@gmail.com&token=624D56DA97BD488A83E24D46034DC0C2',reqOptions)

    
       var codigo = JSON.stringify(code.data)
       console.log(codigo)
        
        res.send(codigo)
    
    }catch(err){

        console.log(err)

            }            
        },
    )

app.post('/notificacao', async function(req,res){})

app.get('/shipcode', async (req,res)=>{
    
    const shipCode = await shipping.authenticate()
    console.log(shipCode)
    res.send(shipCode)
    
})

app.get('/shiptoken', async (req,res)=>{
    //console.log("parametros " + JSON.stringify(req.params))
    //let code = req.params.code
    //console.log(typeof req.body.code+ req.body.code)
    const shipToken = await shipping.shipToken(req.body.code)
    console.log(shipToken)
    res.send(shipToken)
    
})

app.get('/refreshshiptoken', async (req,res)=>{
    //console.log("parametros " + JSON.stringify(req.params))
    //let code = req.params.code
    const refreshToken = await shipping.refreshToken()
    console.log(refreshToken)
    res.send(JSON.stringify(refreshToken))
    
})

app.post('/shipcalc', async function(req,res){

    var quant = parseInt(req.body.quant)
    var cep = req.body.cep
    //LER O CORPO DA REQUISICAO E PEGAR O NUMERO DE itensInCart
    const ships = await shipping.shipCalc("03683000",cep,quant)
    //JA FOI AUTENTICADO
    console.log(ships)
    
    res.send(ships)
    
})

app.post('/shipcart', async (req,res)=>{
    //var reqBody = JSON.stringify(req.body)
    const shipCart = await shipping.shipCart(req.body)
    console.log('shipcart: ', shipCart)
    const shipCheckout = await shipping.shipCheckout(shipCart.data.id)
    console.log('shipcheckout:',shipCheckout.status,shipCheckout.data)
    var response = {
        "shipCart":shipCart.data.id,
        "shipCheckout":shipCheckout.data
}
    res.send(response)
    
})


module.exports = app