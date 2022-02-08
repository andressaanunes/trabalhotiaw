const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')
const sequelize = require('../model/Db')
const apiTokens = sequelize.apiTokens
const dayjs = require('dayjs');
const { Sequelize } = require('../model/Db');
var FormData = require('form-data');
//const ipInfo = require('../testeReq')
const https = require('https')

const me = new melhorEnvioSdk({
  client_id: '6627',
  client_secret: 'YzXJzwPgW7qy2409KLRqNGPbjwjGnGsvWhkgJbJK',
  sandbox: false,
  bearer:'',
  redirect_uri: 'https://www.crialuth.com/shiptoken',
  scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
})  

//const intercept = axios.create({timeout: 100});
/*axios.interceptors.request.use(request => {
  console.log('INTERCEPTED Starting Request', JSON.stringify(request, null, 2))
  return request
})

axios.interceptors.response.use(response => {
  console.log('INTERCEPTED Response', response)
  console.log('INTERCEPTED Response', JSON.parse(response, null, 2))
  console.log('INTERCEPTED Response:', JSON.stringify(response, null, 2))
  return response
})*/
pegaToken()

async function pegaToken(){
  
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
 
    let tokenObj = await apiTokens.findAll({
      where: {
          api: "menv"
          }
      }).then(res => {
        console.log('res',res)
        return res[0]
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
//console.log('O TOKEN REINICIA CADA VEZ Q O SERVER INICIA, ENTAO ME.BEARER É TEMPORÁRIO PARA PRODUÇÃO DEVE SER UTILIZADO UM NOVO TOKEN GERADO PELAS FUNÇÕES DA CONTROLLER')


async function authenticate() {

  //utiliza os atributos da classe "me" para construir a url que deve ser acessada e que também retornará o código utilizado para pegar o token
  console.log('me.bearer dentro de authenticate:'+me.bearer)
  var options = {scope:me.scope}
  const url = await me.auth.getAuth(options)
  console.log(url)
  return url

}

//authenticate()

/* async function shipToken(code){
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
      
    //ipInfo()    
    pegaToken()

  }catch(err){
    console.log(err)
    return err
  }
} */



//CONFERIR O CERTIFICADO SSL ESTÁ RETORNANDO ERRO NO MELHORNEVIO POR CAUSA DISSO
async function saveToken(tokenObj){

  try{
      console.log('CHEGOU NO SAVETOKEN')
      
      let destroy = await apiTokens.destroy({truncate:true})
      console.log('DESTROY'+destroy)

      let token = await apiTokens.create({tokenObj})
      console.log('TOKEN:'+token)

      return {success: true, token: token}

  }catch(err){

    console.log('ERRO NO SAVETOKEN: '+ err)
    return err

  }
}

async function shipToken(code){
  try{
    console.log('CHEGOU NO SHIPTOKEN CERTO')

    const token = await me.auth.getToken(code)
    console.log('NOVO TOKEN:'+ token.data.access_token)
      
      if (token.data.access_token) {

          var tokenObj = {
    
            token: token.data.access_token,
            refreshToken: token.data.refresh_token,
            expDate: dayjs().add(token.data.expires_in,'seconds').format()
        }

      }else{

          throw new Error('ERRO AO PEGAR TOKEN')
      
      }

      console.log('CHEGOU O TOKENOBJ' + tokenObj)
      let tokensaved = await saveToken(tokenObj)
      if (tokensaved.success) {
        
          return true 
      
      }else{
          
        throw new Error('ERRO AO SALVAR TOKEN')
      
      }    
    
  }catch(err){
    
    console.log('ERRO NO SHIPTOKEN: '+ err)
    return err
  
  }
}



async function shipTokenReq(code){
    
    try{
    var data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('client_id','6627');
    data.append('client_secret', 'YzXJzwPgW7qy2409KLRqNGPbjwjGnGsvWhkgJbJK');
    data.append('redirect_uri', 'https://www.crialuth.com/shiptoken');
    data.append('code', code);

    var config = {
      method: 'POST',
      url: 'https://melhorenvio.com.br/oauth/token',
      headers: { 
        'Accept': 'application/json', 
        'User-Agent': 'CriaLuth kayrodanyell@gmail.com', 
        ...data.getHeaders()
        },
        data : data,
        proxy: false
        //httpsAgent: new https.Agent({ rejectUnauthorized: false })
    };

    const token = await axios(config)
    if (token.data.access_token) {

      var tokenObj = {

        token: token.data.access_token,
        refreshToken: token.data.refresh_token,
        expDate: dayjs().add(token.data.expires_in,'seconds').format()
      }

    }else{

        throw new Error('ERRO AO PEGAR TOKEN')
    
    }


    console.log('CHEGOU O TOKENOBJ' + tokenObj)
    let tokensaved = await saveToken(tokenObj)
    if (tokensaved.success) {
      
        return true 
    
    }else{
        
      throw new Error('ERRO AO SALVAR TOKEN')
    
    }    

  }catch(err){
    console.log('ERRO NO SHIPTOKENREQ: '+ err)
    return err
  }
}

//!TESTAR DISPARAR AS FUNÇÕES SHItOKEN E AUTHENTICATE VIA API COM SERVER RODANDO PARA GUARDAR NO BANCO, NAO HA MAIS ERROS DE TIPAGEM

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
                    "token":tokenRefresh.dataValues.access_token,
                    "refreshToken":tokenRefresh.dataValues.refresh_token,
                    "expDate": dayjs().add(tokenRefresh.dataValues.expires_in,'seconds').format()
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
  //quant = 1
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
    const shipcalc = await me.shipment.calculate(payload,me.bearer)
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
    url: 'https://melhorenvio.com.br/api/v2/me/shipment/checkout',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer '+me.bearer, 
      'User-Agent': 'crialuth kayrodanyell@gmail.com'
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
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

async function menvShipCheckout(id){
  var data = {
    "orders": [
      id 
    ]    
  }
  var checkout = await me.shipment.checkout(data,me.bearer)
  console.log("🚀 ~ file: melhorenvio.js ~ line 329 ~ menvShipCheckout ~ checkout", checkout)
  return checkout
  
}

async function testeReq(){
  try {
    let resp = axios('https://ipinfo.io/ip') 
    return resp
  } catch (error) {
    console.log(error)
    
  }
}
testeReq()

module.exports = {
  //shipToken: shipToken,
  shipTokenReq: shipTokenReq,  
  authenticate: authenticate,
  shipCheckout: shipCheckout,
  menvShipCheckout: menvShipCheckout,
  shipCalc:shipCalc,
  shipCart:shipCart,
  refreshToken:refreshToken
}

//eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhkMTE4NTdmMWVkMjllYjRjYTc3YzAzZDczNDRkZmFmZmQ2YTBjYmEyNTYwNThmZGQ0ZDhkMzQ4NzA2YzlkNWM0ODhiODUwMzUzNmIzN2RmIn0.eyJhdWQiOiIxIiwianRpIjoiOGQxMTg1N2YxZWQyOWViNGNhNzdjMDNkNzM0NGRmYWZmZDZhMGNiYTI1NjA1OGZkZDRkOGQzNDg3MDZjOWQ1YzQ4OGI4NTAzNTM2YjM3ZGYiLCJpYXQiOjE2NDQxNjQ4MjcsIm5iZiI6MTY0NDE2NDgyNywiZXhwIjoxNjc1NzAwODI3LCJzdWIiOiJmODQyZjAxNy0zZjc1LTRkZDAtOGJkYi03NDkyNTU2MzkwMzciLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSJdfQ.2i5-81SKySsaNPVldztPH5uak7xmmUVkMp5Gj3smUM8BQjFI7hvFXgxOFapmvxeUyKtqcnm2KdvW4v7573EkEd3UXjXYIAa6CTLbezKojhBnNRuPr-IXB12VVWMe9MCmqdJATi2l3F3gytStjI9t7zp7nvddbk9mgeM5nYMMLezWpmJu-0Sw0txKgDu1DcumXmcFbpTVdfGIqrr37h6kLJMldK-K726WbSvR3I5HgistebMQgxhC9ZpuK4oYqDZoI3NNZBGESFuOJwVBktll9NNkscvhA8DAfrR2deMNF9IhNTpFnb7dKQ7bLy9EjudNTP0iQwCKMbmd8Wc_4neNfuz39DnyTNWxyZ2v-GsFmWl7D9qwV221zo4KeFuHDpwRJBFDGoTlALWu8rBTCe-JtqoPTHMOLgTlhu4OJnjiO_2PRRQjZGsMtPdcZKZD2_vGbiBRuogPaqvLTmaHvqptEzYIXiErZL6hZEHBn52nud7PpLll6hBIEN_x3_xTZmKPFCVfMbXpXyujaP6mt0FmP2fnLZPAIfwI1A0tsnHRhF7FhFPaYwllEWw3AxSfywfjeT9-caFutC6rtekB5BXsIfLnng1sFp2js2RGQRsnDnlgRJFIVdzm45RxDaotkdgAz3vRiUkS8p3TkorL46X1HM4u29lXE9SLb-Ypl7scr6w