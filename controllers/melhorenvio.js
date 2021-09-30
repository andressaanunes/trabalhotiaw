const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')
const sequelize = require('../model/Db')
const apiTokens = sequelize.apiTokens
const dayjs = require('dayjs')




const me = new melhorEnvioSdk({
  client_id: '1434',
  client_secret: 'i7a60hMMpXuVIVFcqXgdYXJRSgZzwaLSHGr3X06S',
  sandbox: true,
  bearer:'',
  redirect_uri: 'http://localhost:5000/',
  scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
})  
pegaToken()
async function pegaToken() {
  
  let token = await apiTokens.findOne({
    where: {
        api: "menv"
        }
    })
  await checkTokenExp(token)
  //console.log(token)
  //console.log(token.dataValues.expDate)
  me.setToken = token.access_token


}
async function checkTokenExp(tokenObj){

  let date = dayjs().format('YYYY-MM-DD')
  let isSame = date === tokenObj.dataValues.expDate ? true : false
  console.log(date)
  console.log(tokenObj.dataValues.expDate)
  console.log(isSame)
  if (isSame) {
    return isSame
  }else{
    await refreshToken()
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
  try{  
    
    //recebe o codigo que vem junto com a url, passa como parametro na função, recebe o token e refresh token e define no me.bearer

    var token = await me.auth.getToken(code) 
    console.log(token.data.access_token)
    console.log(token.data.refresh_token)
    console.log(token.data.expires_in)
    var newToken = {
                    "api":"menv",
                    "token":token.data.access_token,
                    "refreshToken":token.data.refresh_token,
                    "expDate": dayjs().add(token.data.expires_in,'seconds').format()
     }
    apiTokens.create(newToken)
    //console.log(me.bearer)
    return token

  }catch(err){
    console.log(err)
    return err
  }
}

//!TESTAR DISPARAR AS FUNÇÕES SHItOKEN E AUTHENTICATE VIA API COM SERVER RODANDO PARA GUARDAR NO BANCO, NAO HA MAIS ERROS DE TIPAGEM
//shipToken('')


async function refreshToken(){

  try {

    let refresh_token =  apiTokens.findOne({
      where: {
          api: "menv"
          }
      })

    const tokenRefresh = await me.auth.refreshToken(refresh_token.dataValues.refreshToken)
    
     var newToken = {
                    "api":"menv",
                    "token":tokenRefresh.data.access_token,
                    "refreshToken":tokenRefresh.data.refresh_token,
                    "expDate": dayjs().add(tokenRefresh.data.expires_in,'seconds').format()
     }
    apiTokens.create(newToken)

    me.setToken = tokenRefresh.data.access_token
    console.log('tokenNovo:' + me.bearer)
    return true

  }catch (error) {

    console.log(error)
    return error

  }
  
}



async function shipCalc(senderCEP,receiverCEP,quant){

  console.log('me.bearer dentro de shipcalc:'+me.bearer.access_token)
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
    
    const shipcalc = await me.shipment.calculate(payload,me.bearer.access_token)
    //console.log(shipcalc)
    return shipcalc.data
    
  }catch(err){
    

    var error = err.response
    console.log('erro ao calcular o frete: '+err)
    
    return error
  }

  
}

async function shipCart(info){
    
  try{
    console.log(info)
    var addCart = await me.shipment.addToCart(info,me.bearer.access_token)
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
  authenticate: authenticate,
  shipCheckout: shipCheckout,
  shipCalc:shipCalc,
  shipCart:shipCart,
  refreshToken:refreshToken
}

