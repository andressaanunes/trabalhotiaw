const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')
const sequelize = require('../model/Db')
const apiTokens = sequelize.apiTokens
const dayjs = require('dayjs');
const { Sequelize } = require('../model/Db');
var FormData = require('form-data');

const me = new melhorEnvioSdk({
  client_id: '2356',
  client_secret: 'SjHWNkOo0K6cZvLrTZEqizXHEDQL20KslfgE4mFY',
  sandbox: true,
  bearer:'',
  redirect_uri: 'https://www.crialuth.com/shiptoken',
  scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
})  

pegaToken()

async function pegaToken() {
  
  let token = await apiTokens.findAll({
    where: {
        api: "menv"
        }
    }).then(res => {
      console.log('res',res)
      return res[0]
    })
  
  console.log('TOKEN = '+ token)
  await checkTokenExp()
  //console.log(token)
  //console.log(token.dataValues.expDate)
  me.setToken = token.token

  //console.log('me.bearer'+ me.bearer)
}

async function checkTokenExp(){    
 
    let tokenObj = await apiTokens.findOne({
        where: {
            api: "menv"
            }
        }).then(res => {
          return res.dataValues
        })

    //console.log('TOKENOBJ  ='+ tokenObj)    
    let date = dayjs().format('YYYY-MM-DD')
    let isSame = date === tokenObj.expDate ? true : false
    //console.log(date)
    //console.log(tokenObj.expDate)
    console.log(isSame)

    if (isSame) {

      await refreshToken()
      
    }else{

      return isSame

    }

  
}
console.log('O TOKEN REINICIA CADA VEZ Q O SERVER INICIA, ENTAO ME.BEARER É TEMPORÁRIO PARA PRODUÇÃO DEVE SER UTILIZADO UM NOVO TOKEN GERADO PELAS FUNÇÕES DA CONTROLLER')


async function authenticate() {

  //utiliza os atributos da classe "me" para construir a url que deve ser acessada e que também retornará o código utilizado para pegar o token
  console.log('me.bearer dentro de authenticate:'+me.bearer)
  var options = {scope:me.scope}
  const url = await me.auth.getAuth(options)
  console.log(url)
  return url 

}

//authenticate()

async function shipToken(code){
  let destroy = await apiTokens.destroy({truncate:true})
  console.log(destroy)
  try{  
        var token = await me.auth.getToken(code).then(res =>{
          console.log("🚀 ~ file: melhorenvio.js ~ line 96 ~ token ~ res", res)
            
            apiTokens.create({
              //api:'menv'+ Math.random(),
              token: res.data.access_token,
              refreshToken: res.data.refresh_token,
              expDate: dayjs().add(res.data.expires_in,'seconds').format()
    
            })
        })
      
    pegaToken()

  }catch(err){
    console.log(err)
    return err
  }
}

async function shipTokenReq(code){
    
    var data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', me.client_id);
    data.append('client_secret', me.client_secret);
    data.append('redirect_uri', me.redirect_uri);
    data.append('code', code);

    var config = {
      method: 'post',
      url: 'https://sandbox.melhorenvio.com.br/oauth/token',
      headers: { 
        'Accept': 'application/json', 
        'User-Agent': 'CriaLuth kayrodanyell@gmail.com', 
        ...data.getHeaders()
        },
      data : data
    };

    axios(config).then(
        function (response){
        console.log(JSON.stringify(response.data));
      })
    .catch(
      function (error){
      console.log(error);
    });
}

//!TESTAR DISPARAR AS FUNÇÕES SHItOKEN E AUTHENTICATE VIA API COM SERVER RODANDO PARA GUARDAR NO BANCO, NAO HA MAIS ERROS DE TIPAGEM
//shipToken('')
async function refreshToken(){
  console.log('====================== chegou no refreshtoken =============================')
  try {

    let refresh_token =  apiTokens.findOne({
      where: {
          api: "menv"
          }
      }).then(res => {
        return res.dataValues
      })

    const tokenRefresh = await me.auth.refreshToken(refresh_token.refreshToken)
    
     var newToken = {
                    "api":"menv",
                    "token":refresh_token.dataValues.access_token,
                    "refreshToken":refresh_token.dataValues.refresh_token,
                    "expDate": dayjs().add(refresh_token.dataValues.expires_in,'seconds').format()
     }
    apiTokens.destroy({where:{api:'menv'}})

    apiTokens.create(newToken)

    pegaToken()
    console.log('tokenNovo:' + me.bearer)
    return true

  }catch (error) {

    console.log(error)
    return error

  }
  
}


async function shipCalc(senderCEP,receiverCEP,quant){

  checkTokenExp()
  quant = 1
  console.log('me.bearer dentro de shipcalc: '+JSON.stringify(me.bearer))
  var peso = parseFloat(quant * 0.5)
    console.log('peso: '+peso)
    if (quant <= 3 ){
    var boxDimens = {
        "height": 19,
        "width": 28,
        "length": 36,
        "weight": peso
    }//! ADAPTAR PARA RECEBER PEDIDOS Q PRECISEM DE MAIS DE 1 PACOTE
  }else if(quant <= 10){
    var boxDimens = {
      "height": 23,
      "width": 40,
      "length": 29,
      "weight": peso
    }
  }  
  var payload = {
    "from": {
      "postal_code": senderCEP
    },
    "to": {
      "postal_code": receiverCEP
    },
    "package": boxDimens//! ADICIONAR CONFIGURAÇÂO PARA MAIS DE 1 CAIXA
  }
  //console.log(payload)
  
  try{
    var boxDimensTeste = {
      "height": 19,
      "width": 28,
      "length": 36,
      "weight": 1
  }
    var payloadTeste = {
      "from": {
        "postal_code": "03683000"
      },
      "to": {
        "postal_code": "30662523"
      },
      "package": boxDimensTeste//! ADICIONAR CONFIGURAÇÂO PARA MAIS DE 1 CAIXA
    }
    const shipcalc = await me.shipment.calculate(payloadTeste,me.bearer)
    console.log('SHIPCALC================='+shipcalc)
    console.log('JSON SHIPCALC==================='+shipcalc)
    return shipcalc.data
    
  }catch(err){
    

    var error = err
    console.log('erro ao calcular o frete: '+err)
    
    return error
  }

  
}

async function shipCart(info){
    
  checkTokenExp()

  try{
    console.log(info)
    var addCart = await me.shipment.addToCart(info,me.bearer)
    return addCart

  }catch(error){
    
    console.log(error.response.data)

  }
  
}

async function shipCheckout(id){
  
  var data = {
    "orders": [
      id 
    ]    
  }
  var config = {
    method: 'post',
    url: 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/checkout',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer '+me.bearer, 
      'User-Agent': 'crialuth kayrodanyell@gmail.com'
    },
    data : data
  };

  try {
    
    const respo = await axios(config)
    console.log(respo)
    return respo

  } catch (error) {
    
    console.log(error)

  }
  
}

module.exports = {
  shipToken: shipToken,
  shipTokenReq: shipTokenReq,  
  authenticate: authenticate,
  shipCheckout: shipCheckout,
  shipCalc:shipCalc,
  shipCart:shipCart,
  refreshToken:refreshToken
}

