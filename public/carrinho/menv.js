const me = {
    client_id: '6627',
    sandboxClient_id: '2382',
    client_secret: 'YzXJzwPgW7qy2409KLRqNGPbjwjGnGsvWhkgJbJK',
    sandboxClient_secret: 'rntPjNCA2MKGirRsdDdtHXP1CEXgfEaRVmIcG8ps',
    user_agent = 'CriaLuth kayrodanyell@gmail.com',
    sandbox: false,
    bearer,
    redirect_uri: 'https://www.crialuth.com/shiptoken',
    url = 'https://www.melhorenvio.com.br',
    sandboxUrl = 'https://sandbox.melhorenvio.com.br',
    scope:'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'
  }  
  
async function buscaToken(){

    const token = await fetch('https://www.crialuth.com/getToken');
    console.log(token)
    me.bearer = token   

}

async function getToken(code){
  //https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=2382&redirect_uri=https://www.crialuth.com/shiptoken&response_type=code&state=teste&scope=cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("User-Agent", me.user_agent);

  var formdata = new FormData();
  formdata.append("grant_type", "authorization_code");
  formdata.append("client_id", me.sandboxClient_id);
  formdata.append("client_secret", me.sandboxClient_secret);
  formdata.append("redirect_uri", me.redirect_uri);
  formdata.append("code", code);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  const tokenRes = fetch(`${me.sandboxUrl}/oauth/token`, requestOptions)
  console.log(tokenRes)
  localStorage.setItem('tokenMenv',tokenRes)

}


async function refreshToken(){
    console.log('====================== chegou no refreshtoken =============================')
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("User-Agent", me.user_agent);

        const formdata = new FormData();
        formdata.append("grant_type", "refresh_token");
        formdata.append("refresh_token", REFRESHTOKENDOLOCALSTORAGE);
        formdata.append("client_id", me.sandboxClient_id);
        formdata.append("client_secret", me.sandboxClient_secret);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        var response = await fetch(`${me.url}/oauth/token`, requestOptions)
        console.log('ResponseRefreshToken'+response);

        config = {
            method: "POST",
            headers: new Headers({'Content-Type' : 'application/json'}),
            body:response
        }
        var tokenRefreshed = await fetch('https://www.crialuth.com/refreshshiptoken', config)
        console.log('tokenRefreshed'+tokenRefreshed)
     
        await buscaToken()
    }catch (error) {
  
      console.log(error)
      return error
  
    }
    
  }

async function shipCalc(senderCEP,receiverCEP,quant){
    
  try{ 
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

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${me.bearer.token}`);
    myHeaders.append("User-Agent", me.user_agent);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
    var response = await fetch(`${me.url}/api/v2/me/shipment/calculate`, requestOptions)
    console.log(response)
    return response.data
  }catch(error){
      console.log(error)
      return error
  }
    
}



async function shipCart(info){
    
    checkTokenExp()
  
    try{
      console.log(info)

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${me.bearer.token}`);
      myHeaders.append("User-Agent", me.user_agent);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: info,
        redirect: 'follow'
      };
      
      let res = fetch(`${me.url}/api/v2/me/cart`, requestOptions)
      console.log(res) 
      const respo = shipCheckout(res.data.id)
      return {'respocheckout':respo,'resCart':res} 
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
      url: `${me.url}/api/v2/me/shipment/checkout`,
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer '+me.bearer.token, 
        'User-Agent': me.user_agent
      },
      data : data

    };
  
    try {
      
      const respo = await fetch(`${me.url}/api/v2/me/shipment/checkout`, config)
      console.log(respo)
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
    console.log("🚀 ~ file: melhorenvio.js ~ line 329 ~ menvShipCheckout ~ checkout", checkout)
    return checkout
    
  }