const me = {
  Client_id: '6627',
  sandboxClient_id: '2382',
  Client_secret: 'YzXJzwPgW7qy2409KLRqNGPbjwjGnGsvWhkgJbJK',
  sandboxClient_secret: 'rntPjNCA2MKGirRsdDdtHXP1CEXgfEaRVmIcG8ps',
  Url : 'https://www.melhorenvio.com.br',
  sandboxUrl : 'https://sandbox.melhorenvio.com.br',
  user_agent : '"" kayrodanyell@gmail.com',
  sandbox: false,
  bearer:'',
  redirect_uri: '/shiptoken',
  scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
}  

async function buscaToken(){

  const myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin","*")
  let options = {
    headers : myHeaders
  }
  let token = await fetch('/getToken',options);
  token = await token.json()
  //console.log('token',token)
  me.bearer = token   

}

async function getToken(){
  //https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=2382&redirect_uri=/shiptoken&response_type=code&scope=cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write
  //https://www.melhorenvio.com.br/oauth/authorize?client_id=6627&redirect_uri=/shiptoken&response_type=code&scope=cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("User-Agent", me.user_agent);

  let code = document.getElementById("inputGetToken").value
  //console.log(code);

  var formdata = new FormData();
  formdata.append("grant_type", "authorization_code");
  formdata.append("client_id", me.Client_id);
  formdata.append("client_secret", me.Client_secret);
  formdata.append("redirect_uri", me.redirect_uri);
  formdata.append("code", code);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  let tokenRes = await fetch(`${me.Url}/oauth/token`, requestOptions)
  tokenRes = await tokenRes.json()
  //console.log(tokenRes)
  me.bearer = tokenRes
  localStorage.setItem('tokenMenv',tokenRes) 


  let config = {
    method: "POST",
    headers: new Headers({'Content-Type' : 'application/json'}),
    body:JSON.stringify(tokenRes)
  }
  let tokenRefreshed = await fetch('/refreshshiptoken', config)
  tokenRefreshed = await tokenRefreshed.json()
  //onsole.log('tokenGuardado',tokenRefreshed)
  //console.log('tokenGuardado',JSON.stringify(tokenRefreshed))

  await buscaToken()

}


async function refreshToken(){
  console.log('====================== chegou no refreshtoken =============================')
  try {
      console.log('me.bearer',me.bearer)
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("User-Agent", me.user_agent);
      myHeaders.append("Access-Control-Allow-Origin","*")

      const formdata = new FormData();
      formdata.append("grant_type", "refresh_token");
      formdata.append("refresh_token", me.bearer.refreshToken);
      formdata.append("client_id", me.Client_id);
      formdata.append("client_secret", me.Client_secret);

      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
      };

      var response = await fetch(`${me.Url}/oauth/token`, requestOptions)
      response = await response.json()
      //console.log('ResponseRefreshToken',response);


      
      let config = {

          method: "POST",
          headers: new Headers({'Content-Type' : 'application/json'}),
          body:JSON.stringify(response)

      }

      let tokenRefreshed = await fetch('/refreshshiptoken', config)
      tokenRefreshed = await tokenRefreshed.json()
      //console.log('tokenRefreshed',tokenRefreshed)
      //console.log('tokenRefreshed',JSON.stringify(tokenRefreshed))
   
      await buscaToken()

  }catch (error) {

    console.log(error)
    return error

  }
  
}

async function shipCalc(senderCEP,receiverCEP,quant){
  
  try{ 
    var peso = parseFloat(quant * 0.5)
    console.log('peso: ',peso)

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
    //console.log("payload: ", JSON.stringify(payload))
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${me.bearer.token}`);
    myHeaders.append("User-Agent", me.user_agent);
    myHeaders.append("Access-Control-Allow-Origin","*")

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(payload),
      };
      
    var response = await fetch(`${me.Url}/api/v2/me/shipment/calculate`, requestOptions)
    //let res = await response.json()
    console.log('response.data',response.data)
    //console.log('response json',res)
    //console.log(JSON.stringify(response))
    return response
}catch(error){
    console.log(error)
    return error
}
  
}



async function shipCartReq(info){
  
  //checkTokenExp()

  try{
    //console.log(info)

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${me.bearer.token}`);
    myHeaders.append("User-Agent", me.user_agent);
    myHeaders.append("Access-Control-Allow-Origin","*")

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(info),
      redirect: 'follow'
    };
    
    let res = await fetch(`${me.Url}/api/v2/me/cart`, requestOptions)
    console.log('resposta Shipcart',res) 
    //const respo = await shipCheckout(res.id)
    return {'respocheckout':respo,'resCart':res} 
  }catch(error){
    
    console.log(error.response.data)

  }
  
}

/* async function shipCheckout(id){
  
  var data = {
    "orders": [
      id 
    ]    
  }

  var config = {

    method: 'post',
    url: `${me.Url}/api/v2/me/shipment/checkout`,
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer '+me.bearer.token, 
      'User-Agent': me.user_agent
    },
    data : data

  };

  try {
    
    const respo = await fetch(`${me.Url}/api/v2/me/shipment/checkout`, config)
    console.log('RESPOTA SHIPCHECKOUT',respo)
    return respo

  }catch(error){
    
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
   ~ file: melhorenvio.js ~ line 329 ~ menvShipCheckout ~ checkout", checkout)
  return checkout
  
} */

async function appInfo(){

  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${me.bearer.token}`);
  myHeaders.append("User-Agent", me.user_agent);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`${me.Url}/api/v2/me/shipment/app-settings`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}


//export {appInfo,shipCalc,shipCartReq,menvShipCheckout,getToken,refreshToken,buscaToken}