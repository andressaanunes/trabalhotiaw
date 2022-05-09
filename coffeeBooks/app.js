var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
   
    res.status(200)
    res.send(appInfo)
})

app.get('/shipcode', async (req,res)=>{
    const shipCode = await shipping.authenticate()
    console.log(shipCode)
    res.send(shipCode)
    
})

app.get('/shiptoken/', async (req,res)=>{

    console.log(req.query.code)
    console.log("CHEGOU AQUI SHIPTOKEN-CODE")
    res.send(req.query.code)
    
    //console.log("parametros " + JSON.stringify(req.params.code))
   
    /* let code = req.query.code
    console.log("🚀 ~ file: app.js ~ line 276 ~ app.get ~ code", code)

    const shipToken = await shipping.shipTokenReq(code)
    
    console.log("🚀 ~ file: app.js ~ line 286 ~ app.get ~ shipToken", shipToken)
    res.send(shipToken) */
    
})

app.get('/getToken', async (req,res)=>{

    try{
        const shipToken = await shipping.pegaToken()
        console.log("🚀 ~ file: app.js ~ line 286 ~ app.get ~ shipToken", shipToken)
        return res.send(shipToken)
    }catch (error) {
        console.log("🚀 ~ file: app.js ~ line 286 ~ app.get ~ shipToken", error)
        return res.status(401).send(error)
    }

})

app.post('/refreshshiptoken', async (req,res)=>{
    try{
        console.log('refreshShipToken',req.body)
        const refreshToken = await shipping.refreshToken(req.body)
        console.log(refreshToken)
        res.send(refreshToken)
    }catch(err) { 
        res.error(err)
    }
})

app.post('/shipcalc', async function(req,res){
    console.log("🚀 ~ file: app.js ~ line 289 ~ app.post ~ req.body", req.body)
    var quant = req.body.quant
    
    var cep = req.body.cep
   
    const ships = await shipping.shipCalc("03683000",cep,quant)
    console.log("🚀 ~ file: app.js ~ line 293 ~ app.post ~ ships", ships)
    
    res.send(ships)
    
})

app.post('/shipcart', async (req,res)=>{
    
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

        
        var code = await axios('https://ws.pagseguro.uol.com.br/v2/checkout?email=matheuscabralu1990@gmail.com&token=444628ad-3cc3-4716-8e6f-6016d2eb25a759820efe445d91de7417fc0bafab0c8b376e-9f2d-4c65-b797-de9a338e2742',reqOptions)

    
       var codigo = JSON.stringify(code.data)
       console.log(codigo)

       res.status(200).send(codigo)

    }catch(err){

        console.log(err)
    }            
})








app.listen(3000)
module.exports = app;
