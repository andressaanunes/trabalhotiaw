const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')
const sequelize = require('../model/Db')
const apiTokens = sequelize.apiTokens
const dayjs = require('dayjs')




const me = new melhorEnvioSdk({
  client_id: '1434',
  client_secret: 'i7a60hMMpXuVIVFcqXgdYXJRSgZzwaLSHGr3X06S',
  sandbox: true,
  bearer,
  redirect_uri: 'http://localhost:5000/',
  scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
})  

async function pegaToken() {
  let token = apiTokens.findAll({
    where: {
        api: "menv"
        }
    })
  console.log(token)
  me.setToken = token.access_token 

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

authenticate()

const testeTime = dayjs().add(2592000,'seconds').format('DD/MM/YYYY')
console.log(typeof(testeTime))

//console.log(data)
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
shipToken('def50200b06ea700b7935627414ce38b02dd9d2c7e61d8b423ce2e258ed05091926ed84de7b7a2e2ef5788c1817ae651469441f78227e9c94d400b56cc69bea4af9fe1d4d2f319677c03606abed782829fb6ef36635c374a77ef3e1c98a0ad03ba8723112875b0c5a4020fc5664e1340525c95fd434c85aa1f8e4cf3fa518f32b8651ecdf9d2b4fff01ae2927ebd36a7670f755fe33ad168743b5fe61e12f0b5fcd897ce024657bee2fb02f89037fa3a07d94ee6eef70c3f3dc209325d57e7805fd0af26d8c3f8ec409ebf8c5e396575965aae4ba3f791fe6b8d0481570d71629ed6e7beefa5a1dab417163fb7804967f1f9560162e9eb1c26925bb08b40815d67910404f20529a4a0a5ef80e8106e83e44b6cc231af8aff710ba6c36f21596aef6d5f19274c4160e4573da29f3f2cd073593057173829883efd7fb9339220403e381b741f5904bf2dd24f59365ae3fda5b6e1644ede6834ffa2a92fcbf7320a493a40ebc3a7cf44c1d29e5e43550306f80d75defbf26567c3626ce5f29d9cb8dd0f9276dfdd160602e34b92d0dae25afdfadec0cc2eb079db0a4c7fa5328e6f1eb86449d5db4e73e4cb638c543d3160a7bfdc8a7e29c10e0633d9b11f138dedf2b4b00cc18223ceda8c2cfba193a90c70460324cae4df8708650c31673fe04429e2963f985513217267bdcf4648acff6ffceabb1054ae61308741011338167d2655f1ee6dfa6ff8adad6e0583c8c5055f37a61184dd6bf969f11fc3cb0ecef257358ce6b72b20d198c5380c97f33c672cee388bfcca1597e525efdbfb43f0937780cf80d40e42f25241b5b5b7c835468f12ce71c8ca7043ecd313e021d143a881daed460ce7023da4f8ed951fbe5ffaf10c4140d8dd1f8898bcb7ca95836e45c69b5cda754d6c1622315021bf02ecc4d1f935676011e695a640c1fccc41ee79ecdc9d03600c676900d30f8b0036bb798d6dee068e7edd6940a4373969942d34e18433f1e422a00a3bc3c1ee3ae1de43d365c889abc5bdc8b4d90aed7b365a0827786c115942d92005fdf0c36e0dd1ca37c77c8498e0db29c9badf4a07289b6ec7a81ac7e8188db6329d59c726890e8775238e09ccc699c1a662a000fc67cdcef55ea4268ab924463f734bcdc76d20a0d20aff51b84169c2916b3e4702ac15eccb')


async function refreshToken(){

  try {

    //pega o refresh toke no me.bearer e usa pra pegar  o novo token, e define o novo token em me.bearer
    
    console.log('tokenAntigo:' + me.bearer.refreshToken)
    const tokenRefresh = await me.auth.refreshToken(me.bearer.refresh_token)
    me.setToken = tokenRefresh
    console.log('tokenNovo:' + me.bearer)
    return tokenRefresh

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

