const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')

const me = new melhorEnvioSdk({
  client_id: '1434',
  client_secret: 'i7a60hMMpXuVIVFcqXgdYXJRSgZzwaLSHGr3X06S',
  sandbox: true,
  bearer:'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5NWU0ZTM0ODNiNzBlMTgzYWRhMTc1MzU3OTQyZjk1ZWQ4ZDM5M2EyZjQyODE3YTNmMTNkOTZlMmZjODU1YWM0ODZiNmRiMWZlOGVjYWI3In0.eyJhdWQiOiI5NTYiLCJqdGkiOiI3OTVlNGUzNDgzYjcwZTE4M2FkYTE3NTM1Nzk0MmY5NWVkOGQzOTNhMmY0MjgxN2EzZjEzZDk2ZTJmYzg1NWFjNDg2YjZkYjFmZThlY2FiNyIsImlhdCI6MTYyNjc1MTI4NCwibmJmIjoxNjI2NzUxMjg0LCJleHAiOjE2NTgyODcyODQsInN1YiI6IjZlZWY1OWU5LTM5MjctNDM5MC1iYjI2LTY0MDEwNzJlN2ZmZiIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIl19.Ki5bqOAu36a90drFgFVnkUuYO5Kk6DL7tGusJ9Q0mw9L4kGQpd9SuVKCQqmHZsthICB6R1fpIb8YoX9x3IkuRGx72OReaRidl_L5V65RIJDuxrqhpSgh4xoLSVSshtPR9LlIz4YZrgASiGQxGu0vZbuz1H0_NBu8NcCOmXM8PYwCccM3XqwUdN022OCBFQfIFNo6F5qdLoQqFHQpkisatn5pefMrCCtgenrbU5PDlb2EanGHFeseWQ7rIt27y1B5ja3hVchKHzKsM8h4tj21crWxb7WF5wM8lhaG-cfmdlC_NKdOcsGhA4v2dAH_SqoBpdh_aq9TbFjqX_mVnsw8-6H6LTa2AGPjhpqWd5PGAZ1b-yEJiHisGlXPZUQXbFXieVMja-ZzROPHMOOmIUsqBnpnLt0j3oKRjUXLaqfeh5QUHf8IPqCABOfD4MUzVllF7qGioi-WO6an2pt7nsz4pJOw4uYd-GFE1FCEkorxV2iW4bLATAE89Cdu1ugax4wAQT1eX1dI1mDZ5NwHkVUCU2bEU_K-WqNndnNbBiMmz8A3QJ8XyzJrvtMSYEV_oFmfvk63yucMJjmeB9vHqG9k80GmAxfTWB08LldxMUYn-SsVnEV_Cd7tzxqJycbR2j6wQq4z6YfFU6hwdaD92i49gewanIFguI5Mdgx3tw6_aXM',
  redirect_uri: 'https://www.crialuth.com/home/',
  scope:
  'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
})  

var refreshToken =  'def5020028d8ce86c7dc08645584be7f0e23578c246f21ba7246581abc2af09fbdeab48f831fdd8d4b66b06e1499bb74b6670a797b06a00a68ba8d1ea443f08a0c2e1d4fbdaedae530cc1f854d11bb63726c60c4eb285daec70d0208b3391fea6d08077df5227c5cd826111cd1ab2b5a633a36093913eee141015be94fca9ddca727d69f9e168a0df3e009e846ac06e483dfad5e32b1ae590591f7054256094379324013b880c0b9f3e9a310f79cab01b14b39a2de08c392371c95bf611a948716c001e1857665bacdb4e06334bc311474c9c16aeaa9e0e91518576a5503071d9c5806d2e3ae6546fbf5c56b56aac5747c626be1abc0b683c57dcc9490aed9a5e3f3195777f5551d601a336218ad8ef79d54f0ab1cc88a30016bd64c23a4d179566fc5a452a22b35d8c9faec64291508f3acdaacd87263a6a1d8fc317341370a3bb193e19b744be9c2eb7d4e7b502674920513ce75d87c57e5fce99433740e22d56546a2c7b9664bb6a3552fd3ce40cd0f2782d44c3bc00d4045e906c2429dd9fb013bd0a3c90ea1d0'

console.log('O TOKEN REINICIA CADA VEZ Q O SERVER INICIA, ENTAO ME.BEARER É TEMPORÁRIO PARA PRODUÇÃO DEVE SER UTILIZADO UM NOVO TOKEN GERADO PELAS FUNÇÕES DA CONTROLLER')


async function authenticate() {

  //utiliza os atributos da classe "me" para construir a url que deve ser acessada e que também retornará o código utilizado para pegar o token
  console.log('me.bearer dentro de authenticate:'+me.bearer)
  const url = me.auth.getAuth()
  console.log()
  return url 
}


async function shipToken(){
  try{  
    
    //recebe o codigo que vem junto com a url, passa como parametro na função, recebe o token e refresh token e define no me.bearer

    var token = await me.auth.getToken('def5020061c774b32b194c74d0eddeda05a795808e6b5e1c3bb21aa0f7f8577badf54fcf3cc4b096eb8e0acaab98d4d83921a5c89d7b759e056230ae845c2a82966f837a29afa1a39d2c0658267c201dbf9ae53dac27a8bbfaf03e6d690a19e00e3220e187f967409660f46aed3e793148755c0ae37125a7bf0edbf5b85ac3b4c33138624a6a0891dd4c72fdb77fcdd0d5cfb080a729ec4b6d8861764a0e2a19cf9d95791dad5ef22ed708cb7e16f26ad0f91f2036d18c893f7f12304d95d74b1b582f03a3c5c6d5d9adda968cab46555cfcd9a2656903465e63031f6d3f3bb3a3dc01b5887637cd4283836f80810549aa2a8b432d51fc8f395dfdd2c819e520212cd5939c6bdabb4679c9ec7b53b66167bc0e74191d7df9599aa0233651778695a6880df08bd6d0bf87d287e0d7bf7baf3174326fc0961d1a48c4f17e3248b618bdf3d8a12136efcc863e48b731111580575a82d4465aedbe3621cf3859a2bb5a0e987dfe597e66d636af193dab2b8db66b522c574486eaf884287c0bb53c66') 
    console.log('token.data='+token.data)
    me.setToken = token.data
    console.log(me.bearer)
    return token

}catch(err){
    console.log(err)
  }
}

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
  authenticate:authenticate,
  shipCheckout: shipCheckout,
  shipCalc:shipCalc,
  shipCart:shipCart,
  refreshToken:refreshToken
}

