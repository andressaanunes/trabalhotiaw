require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const prods = require('./controllers/produtos')
const auth = require('./middlewares/auth')
const isAdm = require('./middlewares/admin')
const users = require('./controllers/users')
const shipping = require('./controllers/melhorenvio')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { URLSearchParams } = require('url');
const axios = require('axios')
const https = require('https')
const produtos = require('./controllers/produtos')




axios.interceptors.request.use(request => {
   // console.log('INTERCEPTED Starting Request', JSON.stringify(request, null, 2))
    return request
})
  
axios.interceptors.response.use(response => {
    console.log('INTERCEPTED Response', response)
    //console.log('INTERCEPTED Response', JSON.parse(response, null, 2))
    //console.log('INTERCEPTED Response:', JSON.stringify(response, null, 2))
    return response
})


const PORT = process.env.PORT

const app = new express()


app.use(cors())

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



app.use('/admin/:userId/:userToken',auth,isAdm, express.static(path.join(__dirname, "adminContent","admin"))) 

app.use('/', express.static(path.join(__dirname, "public")))

/* app.get('/',(req, res) =>{
    res.redirect("https://www.crialuth.com/home/")
}) */

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
                console.log("🚀 ~ file: app.js ~ line 194 ~ app.post ~ error", error)
               
                res.status(400)
                res.send(error)
    
            } else {
                
                console.log("🚀 ~ file: app.js ~ line 203 ~ app.post ~ user", user)
                res.header({token:users.generateToken({nome:user.nome})})
                res.send({user})
                
    
            }
    
        }catch(err){
            console.log(err)
            console.log("🚀 ~ file: app.js ~ line 210 ~ app.post ~ err", err)
            //res.status(400)
            res.send({error: `registration failed ${err}`})
        } 
    })

app.post('/login', async (req,res)=>{

    const user = await users.buscaEmail(req.body.email)
    console.log("🚀 ~ file: app.js ~ line 216 ~ app.post ~ user", user)
    if(user.error){
        res.status(400)
        res.send({error:'Endereço de Email não encontrado'})
    }else{
        
        if(await bcrypt.compare(req.body.password,user.dataValues.senha)){ 
        console.log("🚀 ~ file: app.js ~ line 223 ~ app.post ~ user.dataValues.senha", user.dataValues.senha)
            
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
    console.log("🚀 ~ file: app.js ~ line 216 ~ app.post ~ user", user.dataValues)

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

app.post('/', async function(req,res){})


app.get('/appinfo', async function(req,res){
    var appInfo = await shipping.appInfo()
    console.log(appInfo)
   // var json = await appInfo.json()
    res.status(200)
    res.send(appInfo)
})

app.get('/shipcode', async (req,res)=>{
    const shipCode = await shipping.authenticate()
    console.log(shipCode)
    res.send(shipCode)
    
})

//?https://www.crialuth.com/shiptoken?code=def50200ce8c38934ef71315334a184c413b913cf2b2040d4a5e67ac402174ccebe85f71cd4b7ac365980305e07173bf18362dfca9441fe24e2cce0f269ae721b8ed3159375f9ef3f38f8e2556d5e5ff0cc536dd889c4a5bb373ade0d656ae7e09ca6716653f3efac52be79ea6485015d2e97c3aa133aaf30c8756c73f57bf855f192e27c6d61cd649232f115439d589a693955681b34726e82e04bd381c5347519c9606d6c18880fc0f3c8813031a9975efa50e73b0d9273b80e3195abf9b4b22b773669e36bfe695f661163881dcbf60fe297e85047e36f5ff2be36d4afac65ac2e52665977e2049f963fe5b3739c47270045100232f8cf5e8b26e79eafb4e3c3c2abbe6c3f5df1f1f2f9a97d088c6d447cfd531bbcaf1fa7bebe3a214490a8f69be5263cbca46879a5e6c6b1e39b20910f524b6887c85ef85bf825a5ef9e52305d4868b7f0cda3d48a03c6539b09c9422ede8168f92081222baf8de6ad6ce160d8d457ce4126dff2b8466b05ded222c77e652158b8e274c78eba0f0fe0c5dcd35b7c45750e4a57ca871d8b2050226d4f7694a65ea045bc2d69cfa01dccafd9370901c667037bb35c8e3b19fcee255c4381e2cef666b17c077f8e1c8a725706da2203160ad4291a1887b5e0ad80b2205563b08e16bef6baf060a276719174fa79f1b878a10590e3917b901bf9935225d89365f99d4d09b7a3118009c9bd17065bcfafb26b62ab0491aab8da25e8afe179eae651b6b7924d907f86ec6b974c1850f457d96cc1e68b12dcb02ac2393db03db89f8ff5b1fbdff6547eda4550efda14bb697cd7a3db25b40af146808af3e474d58dbc174de5eca27587a226b9a8510830af612450b036e65b5d1b9680bf89eb3d27709abacfcb62d3871b28b2aa0e6bac28b30d382f5e5f4d628819ddd92000cccfefe6d30ce5852875820dbd989904c99dca78385deea2a809ec5e7d3b51bde31ca83550dfb430744c5b09670fe32146dbcdcdb45a7ea480f872a532526a5b6aaa1ae50fc0e6bc6e41b8b202e8ef7c14cfb3f5d59925a986834f32a589f2e0e28ac00b5c054fc2013769370028cf5fc9bfffca8c494e08f04880a2a42eaf990a5a6b8e8bb9681bbb6252e012c3521989db6a1fa78eb5c0535a5850e1054030efade92de7ef1f606526c6b7d16bf33859c2934ef91708d1fe1167d


app.get('/shiptoken/', async (req,res)=>{

    console.log(req.query.code)
    console.log("CHEGOU AQUI SHIPTOKEN-CODE")
    //console.log("parametros " + JSON.stringify(req.params.code))
   
    let code = req.query.code
    console.log("🚀 ~ file: app.js ~ line 276 ~ app.get ~ code", code)

    const shipToken = await shipping.shipTokenReq(code)
    
    console.log("🚀 ~ file: app.js ~ line 286 ~ app.get ~ shipToken", shipToken)
    res.send(shipToken)
    
})

app.get('/getToken', async (req,res)=>{

    try{
        const shipToken = await shipping.pegaToken()
        return res.send(shipToken)
    }catch (error) {
        return res.status(401).send(error)
    }

})

app.post('/refreshshiptoken', async (req,res)=>{
    try{
        console.log('refreshShipToken'+req.body)
        const refreshToken = await shipping.refreshToken(req.body)
        console.log(refreshToken)
        res.send('')
    }catch(err) { 
        res.error(err)
    }
})

app.post('/shipcalc', async function(req,res){
    console.log("🚀 ~ file: app.js ~ line 289 ~ app.post ~ req.body", req.body)
    var quant = req.body.quant
    
    var cep = req.body.cep
    //LER O CORPO DA REQUISICAO E PEGAR O NUMERO DE itensInCart
    const ships = await shipping.shipCalc("03683000",cep,quant)
    console.log("🚀 ~ file: app.js ~ line 293 ~ app.post ~ ships", ships)
    //JA FOI AUTENTICADO
    
    res.send(ships)
    
})

app.post('/shipcart', async (req,res)=>{
    //var reqBody = JSON.stringify(req.body)
    const shipCart = await shipping.shipCart(req.body)
    console.log('shipcart: ', shipCart)
    const shipCheckout = await shipping.menvShipCheckout(shipCart.data.id)
    console.log('shipcheckout:',shipCheckout.status,shipCheckout.data)
    var response = {
        "shipCart":shipCart.data.id,
        "shipCheckout":shipCheckout.data
}
    res.send(response)
    
})

app.post('/pagamento', auth, async (req,res) => {
    console.log('TEM QUE ATIVAR MIDDL  DE AUTENTICAÇÃO PRA COLOCAR EM PRODUÇÃO')
    //res.status(200).send() 
    console.log('ROTA PAGAMENTO REQUISIcaO:',req)
    try{
        var searchParams = new URLSearchParams(req.body)
        var bodyForm = searchParams.toString()
        
        console.log('bodyForm'+bodyForm)

        var reqOptions = {
        method:'POST', 
        header: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data:bodyForm
        }
        
        console.log('reqOptions'+reqOptions)

        //!COLOCAR O TOKEN DE PRODUCAO E EMAIL TABMÉM
        var code = await axios('https://ws.pagseguro.uol.com.br/v2/checkout?email=matheuscabralu1990@gmail.com&token=444628ad-3cc3-4716-8e6f-6016d2eb25a759820efe445d91de7417fc0bafab0c8b376e-9f2d-4c65-b797-de9a338e2742',reqOptions)

    
       var codigo = JSON.stringify(code.data)
       console.log(codigo)
     //console.log('ROTA PAGAMENTO RESPOSTA:',res)
       res.status(200).send(codigo)

    }catch(err){

        console.log(err)

            }            
        },
    )


module.exports = app	