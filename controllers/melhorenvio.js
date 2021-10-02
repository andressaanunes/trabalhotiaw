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
  await checkTokenExp()
  //console.log(token)
  //console.log(token.dataValues.expDate)
  me.setToken = token.access_token


}

async function checkTokenExp(){    

    let tokenObj = await apiTokens.findOne({
        where: {
            api: "menv"
            }
        })


    let date = dayjs().format('YYYY-MM-DD')
    let isSame = date === tokenObj.dataValues.expDate ? true : false
    console.log(date)
    console.log(tokenObj.dataValues.expDate)
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
  try{  
    
    //recebe o codigo que vem junto com a url, passa como parametro na função, recebe o token e refresh token e define no me.bearer

    var token = await me.auth.getToken('def50200d18869de74d66409555dd2e60d497cb082be9d74a210d5d7fd39c1e07ace559531ebd84b0c48166b7cf96adb333fa4b6e5e46dfc48ca59360642c5a13c896fc6ed6620064b168fc9a5e02e341e3bebb5c76d5bbe56131dd9dfa3374e06674da2970ecd770374d135ae37f2ec4f6dc866d46745f839be2618cc7053d547501ef448adcc82745546950c9f025d683168d27286d0029481eef481bebcaffa071c0a561202f1bad0e40b7dd9c2a30fb6a042c4caeef95d919c939eea8d3f1e4ebbe4b6c2c4b1f0016271797e4d96cf8a14b1ceefafe0ec68b2e6d1cbc82708e475d72759227c336678d5bea28e49c037ac44172428827ac3b00c0ff9fe6ab07ca17f94b70edf6beceaf9326d41b1ff32f4eb8fdea9a9d69ca59269cbcb1aabc68b902697eb929894b1430f57391d1ee3be90b0c379c24cad8914e6c90808419b3e4c7ba2b4086464dc9199a9cf400b3786c5ead470ffd863dcd3076f986ae98a9567cdf05c8c9caa92d0dcbec6cdd22ecefab9e680311c6074579d3034aac6e49be7ed4ab4a8e926b6b6ad7ac7bdff3fb294ae9f4f348bda00289796889e6c31403fc78cf88840ba4d84d938596dee0903e3693f197e0ec9bd4fa6349f38e20346645d3c72c78b6642a2ef16ad244ddea4a6c644443066054995dee0dcac35ecc6a8bb98fc1ae9954b0e55560e6be4a45f9acf140f0135d91950306a98df3cbfa9d8f0d0b1e4b883d649d6b81049f1d114b7ac657580aff0151a8246927c24784a2e3632647be6aaed3aa1b7f5eb1db0ec7d132a29c776847cf0f817c3102d2f877dd520d8f1cc1354ae0d2dda2d82aae2b98d86c47aa5669b29521efc4c0c239989b37e48899114c3e052f0eeb4dfbe1a86295ca774ae9ca5822e89dc06f77a152d0540fa9194314f330c6d7d8c18b080d5af90b8283a8787ab5c199d19b96233333a53e6fb3bf36e9e2b23a101a2ae57e2db26d7d003872f89ead22ba4f9986aad72279a5c8d11635b5bd76c7d532a56c6a4e971d656baacae28fd0f41dac98da43dd29e33a9870768c07f8f19ea644ec2f368f6032d1a2ea05bad918ef2344d56135883c3bed115697ca3cc8f6ee13c1d8cf3c4474cb5eba7d356b40c842b47ee6251a1af954947dd84d7a61ba4cbdba34689909472defdad213891b044') 

    console.log(token.data.access_token)
    console.log(token.data.refresh_token)
    console.log(token.data.expires_in)
    var newToken = {
                    "api":"menv",
                    "token":token.data.access_token,
                    "refreshToken":token.data.refresh_token,
                    "expDate": dayjs().add(token.data.expires_in,'seconds').format()
     }
    apiTokens.destroy({where:{api:'menv'}})
    
    apiTokens.create(newToken)
    //console.log(me.bearer)
    pegaToken()
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

  checkTokenExp()

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
    
  checkTokenExp()

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

