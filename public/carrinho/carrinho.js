//FUNCAO DE BUSCA

import * as menvjs from '/carrinho/menv.js'
console.log('import * as menvjs from "/carrinho/menv.js"')

document.addEventListener('DOMContentLoaded',listProds)

menvjs.buscaToken()

var cepCalc = document.getElementById('cepCalc')
cepCalc.addEventListener('click',shipValues)


var formatter = new Intl.NumberFormat('pt-BR',{
    style:"currency",currency:"BRL"})



function prodQuant(item,itemQuant,itemPrice,itemIndex,itemId,itemPrecoUnit){

    var formatter = new Intl.NumberFormat('pt-BR',{
        style:"currency",currency:"BRL"})
    
    
    var cartitems = JSON.parse(sessionStorage.getItem('cartItems'))
    
    let quant = parseInt(document.getElementById(itemIndex+'quantity').value) 
    
    cartitems[itemIndex].quantity = quant
    
    console.log(quant)
    let newPrice = quant * itemPrecoUnit
    console.log(newPrice)
    document.getElementById(`${itemIndex}prodPrice`).innerHTML = ''
    document.getElementById(`${itemIndex}prodPrice`).innerHTML = formatter.format(newPrice)
    console.log(itemId)
    //console.log(changePrice)
    sessionStorage.setItem('cartItems',JSON.stringify(cartitems))
        
    changeItensInCart()
    changeSubtotal()
}



async function listProds(){
    var tabela = document.getElementById('prodList')
    var item = sessionStorage.getItem('cartItems')    
    item = JSON.parse(item)
    console.log(item)
    if(item === null || Object.keys(item).length===0 ){
        tabela.innerHTML= `
        <tr>
        <td></td>
        <td></td>                           
        <td></td>
        <td id="prodPrice" class="text-right">Seu Carrinho Está Vazio!</td>
        <td></td>
        </tr>` 
        }
    var subTotal = 0;
    
    Object.values(item).map(itens => {    
        
        if(itens.type === 1){    
            var price = 44.99

        }else if(itens.type === 2){ 
            var price = 54.99

        }else if(itens.type ===3){ 
            var price = 19.99
            
        }
        
       var index = item.indexOf(itens)
       console.log(index)

        subTotal += parseFloat(price*itens.quantity)
        let unformattedPrice = parseFloat(price*itens.quantity)

        price = formatter.format(price*itens.quantity)
       console.log(itens)
        tabela.innerHTML += `
        <tr id="${itens.id}" class ="prodRow">                   
        <td><img id="prodImg" src="${itens.img}" /> </td>
        <td id="${index}">${itens.nome}</td>                         

        <td><input id="${index}quantity" onchange="prodQuant('${itens.nome}',${itens.quantity},${unformattedPrice},${index},${itens.id},${itens.precoUnit})"  class="form-control prodQuantity" type="text" value="${itens.quantity}" /></td>

        <td id="${index}prodPrice" class="text-right ">${price}</td>
        <td class="text-right"><button onclick="excluirProduto(this)" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button></td>
        </tr>
        `
        
        console.log(subTotal)
        })
        tabela.innerHTML += ` 
        <tr>                           
            <td></td>
            <td></td>
            <td></td>
            <td>Sub-Total</td>
            <td id="subTotal" class="text-center" >${formatter.format(subTotal)}</td>
        </tr>
        `

}


async function excluirProduto(btn){
    
    var prodRow = btn.closest('.prodRow')
    var prodName = prodRow.children[1]
    
    var prodIndex = parseInt(prodName.getAttribute('id'))
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    
    console.log(prodIndex)
    console.log(cartItems)
    
    cartItems.splice(prodIndex,1)
    console.log(cartItems)
    sessionStorage.setItem('cartItems',JSON.stringify(cartItems))
    location.reload()
    

}

async function getToken(){
    await menvjs.getToken()
}
document.getElementById('btnGetToken').addEventListener('click',getToken)

async function refreshToken(){
    await menvjs.refreshToken()
}
document.getElementById('refreshTokenBtn').addEventListener('click',refreshToken)

function changeItensInCart(){
    let newQuantity = 0

    let cartitems = JSON.parse(sessionStorage.getItem('cartItems'))

    cartitems.forEach(element => {

        newQuantity += element.quantity
    });
    
    sessionStorage.setItem('itensInCart', newQuantity)
}

function changeSubtotal(){
    let subtotal = 0

    let cartitems = JSON.parse(sessionStorage.getItem('cartItems'))

    cartitems.forEach(element => {

         subtotal += element.quantity * element.precoUnit
    });
    var subTotal =  document.querySelector('#subTotal').innerHTML = formatter.format(subtotal)
}



var trash = document.getElementById('excluiProd')

var json;
async function shipValues(){

    const clientCEP = document.getElementById('clientCEP').value
    const itensInCart = parseInt(sessionStorage.getItem('itensInCart'))    

    /* config = {
        method: "POST",
        headers: new Headers({'Content-Type' : 'application/json'}),
        body:JSON.stringify({
                "quant":itensInCart,
                "cep":clientCEP
             })
    } */

    var shipValues = await menvjs.shipCalc("03683000",clientCEP,itensInCart)
    console.log("🚀 ~ file: carrinho.js ~ line 171 ~ shipValues ~ shipValues", shipValues)
    
    json = await shipValues.json()

    
    var tabela = document.getElementById('shippings')
    var shippingForm = document.getElementById('shippingForm')
    tabela.innerHTML =''
    shippingForm.innerHTML = '' 
    Object.values(json).map(ships=>{
        if (ships.id === 17) {
            return true
        }
        if (ships.error) {
            shippingForm.innerHTML +="<div class='alert alert-danger' role='alert'>CEP não encontrado!</div>" 
        }
        shippingForm.innerHTML += 
        `
            <div id = "${ships.company.name}${ships.name}" class="col-12 form-check ">
                <img class="float-left transpImg" src="${ships.company.picture}" alt="${ships.company.name}">
                <label for="${ships.name}">${ships.company.name} ${ships.name}: ${formatter.format(ships.custom_price)} </label>
                <input id="${ships.name}" type="radio" class="float-end" name="shipValue" value="${ships.id}">
                <p type="hidden"></p>
                <p>Tempo de entrega: ${ships.custom_delivery_range.min} a ${ships.custom_delivery_range.max} dias úteis</p>
            </div>
        `
    })
    tabela.innerHTML +=`
    <p style="margin-bottom:2px;"><strong>Tempo de produção e postagem para entrega:</strong></p>
    <li>Quadros personalizados: até 7 dias úteis</li>
    <li >Quadros não personalizados: até 3 dias úteis</li> 
    
    <button style="margin:5px;" id="btn-salvar" class="btn btn-primary" type="button">Selecionar Frete</button>
    <p id = "shiptotal">Valor do Frete:</p>`
    var shipSelect = document.getElementById('btn-salvar')
    shipSelect.addEventListener('click',setShipInfo)
    var totalPrice = 0

}

//document.addEventListener('DOMContentLoaded',shipCalc('03683000','30662523',1))



    async function setShipInfo(event){
    event.preventDefault()
    
    var form = document.getElementById('shippingForm')
    var shipTotal = document.getElementById('shiptotal')
    var shipId = parseInt(form.shipValue.value)

    for(var item of json ){
        

        if(item.id == shipId){
            sessionStorage.removeItem('shipInfo')
            sessionStorage.setItem('shipInfo',JSON.stringify(item))
            
        }

    }
    
    var shipValue = JSON.parse(sessionStorage.getItem('shipInfo'))
    shipTotal.innerHTML = ` R$${formatter.format(shipValue.price)}`
    totalPrice += parseFloat(shipValue.price)


    var subTotal =  document.querySelector('#subTotal').innerHTML
    subTotal = subTotal.replace('R$&nbsp;','')
    subTotal = subTotal.replace(',','.')
    console.log(totalPrice)
    var conta = parseFloat(subTotal)+totalPrice
    console.log(conta)
    tabela.innerHTML +=
    `<div>
        <div>
            <p class="text-end"><strong>Total:  </strong><strong>${formatter.format(conta)}</strong></p>
        </div>
    </div>   `
        }









document.getElementById('shipCartBtn').addEventListener('click',shipCart)

async function buildPayload(){

    

    let userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
        Swal.fire({
            title: 'Você não está logado!',
            text: "Você precisa fazer login para continuar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Voltar',
            confirmButtonText: 'Fazer Login'
          }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Você será redirecionado para página de cadastro',
                    showConfirmButton: false,
                    timer: 3000
                  }).then(() => {
                    window.location.replace(`https://www.crialuth.com/signup`)
                  })
                
            }
          })
        
    }
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    console.log('cartItems 2 ',cartItems)
    userInfo = JSON.parse(userInfo)
    console.log('userInfo ',userInfo)

    var dataPart1 = {
        "currency":"BRL"
    }

    var i = 0

    for(var key in cartItems){

        var tipo = cartItems[key].type
        var cor = cartItems[key].cor
        if (tipo == 1) {
            tipo = 'acetato'
        } else if( tipo == 2){
            tipo = 'vidro'
        }else{
            tipo == 'placa'
            cor = ''
        }
        i=i+1
        var price = cartItems[key].preco
        dataPart1[`itemId`+i] =  cartItems[key].id
        dataPart1[`itemDescription`+i] =  cartItems[key].nome +'|', tipo +'|', cor
        dataPart1[`itemAmount`+i] =  price
        dataPart1[`itemQuantity`+i] =  cartItems[key].quantity
        dataPart1[`itemWeight`+i] =  (cartItems[key].quantity * (0.5*1000))        
        
    }
    
    console.log(dataPart1)
    //! item id ta dando undefined (nao ta vindo da pagina do produto)
    var senderPhone = userInfo.tel.substring(2)
    var senderAreaCode = userInfo.tel.split('',2)
    
    var shippingCost = JSON.parse(sessionStorage.getItem('shipInfo'))
     console.log(shippingCost)

    var dataPart2 = {
        "senderName":userInfo.nome,  
        "senderAreaCode":senderAreaCode[0]+senderAreaCode[1],
        "senderPhone":parseInt(senderPhone),
        "senderEmail":userInfo.email,
        "senderCPF":userInfo.cpf,
        "shippingType":3,
        "shippingAddressRequired":true,
        "shippingAddressStreet":userInfo.rua,  
        "shippingAddressNumber":userInfo.numero,                  
        "shippingAddressComplement":userInfo.complemento,            
        "shippingAddressDistrict":userInfo.bairro,    
        "shippingAddressPostalCode":userInfo.cep,           
        "shippingAddressCity":userInfo.cidade,                
        "shippingAddressState":userInfo.estado,                      
        "shippingAddressCountry":"BRA",
        "shippingCost":shippingCost.custom_price,                
        "paymentMethodGroup":"CREDIT_CARD,BALANCE,BOLETO,DEPOSIT,EFT" 
    }
    var data = {...dataPart1,...dataPart2}
    console.log('data',JSON.stringify(data))
    return data

}


async function buildMenvCorreiosPayload(){
    var shipInfo = JSON.parse(sessionStorage.getItem('shipInfo'))
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    var itensInfo = JSON.parse(sessionStorage.getItem('cartItems'))

    let payload1 ={
        "service": shipInfo.id
    }
        
    var products =[]
    
    for( var i=0; i < itensInfo.length; i++){
        
    }
    
    for (let key in itensInfo) {
        let iten = {
            "name": itensInfo[key].nome,
            "quantity": parseInt(itensInfo[key].quantity),
            "unitary_value": parseFloat(itensInfo[key].preco)
            }
        products.push(iten)
    }
    var payload3= {
    
        "products": products     
    }
    
    var payload2 = {
        
        "from": {
          "name": "Matheus Cabral Uchôa",
          'phone': "31994883720",
          "email": "matheuscabralu1990@gmail.com",
          "document": "02235906656",      
          'address': "Rua José Gomes Ferreira",
          "complement": "",
          'number': "1011",
          "district": "Novo Amazonas",
          "city": "Betim",
          "country_id": "BR",
          "postal_code": "32684395",
          "note": ""
        },
        "to": {
          "name": userInfo.nome,
          "phone": userInfo.tel,
          "email": userInfo.email,
          "document": userInfo.cpf,
          "address": userInfo.rua,
          "complement": userInfo.complemento,
          "number": userInfo.numero,
          "district": userInfo.bairro,
          "city": userInfo.cidade,
          "state_abbr": userInfo.estado,
          "country_id": "BR",
          "postal_code": JSON.stringify(userInfo.cep),
          "note": "observação"
        }
      }     
      
      var insuranceValue = 0
      for (const iten in itensInfo) {

        var value = itensInfo[iten].preco
        insuranceValue += parseFloat(value.replace(',','.'))
        
      }

      var payload5 = {
            "options":{
                "insurance_value": insuranceValue,
                "receipt": false,
                "own_hand": false,
                "reverse": false,
                "non_commercial":true,
            }
        
      } 
 
      const menvBody = {...payload1,...payload2,...payload3,...payload4,...payload5}
      
      return menvBody
}

async function buildMenvJadlogPayload(){

    var shipInfo = JSON.parse(sessionStorage.getItem('shipInfo'))
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    var itensInfo = JSON.parse(sessionStorage.getItem('cartItems'))

    let payload1 ={
        "service": shipInfo.id
    }
    
    if(payload1.service === 3 || payload1.service === 4 ){
        
        payload1['agency'] = 1158
        

        var products =[]
        
    
        for( var i=0; i < itensInfo.length; i++){
            
        }
        
        for (let key in itensInfo) {
            let iten = {
              "name": itensInfo[key].nome,
              "quantity": parseInt(itensInfo[key].quantity),
              "unitary_value": parseFloat(itensInfo[key].preco)
              }
            products.push(iten)
        }
        var payload3= {
        
            "products": products     
        }
    }    


    var payload2 = {
        
        "from": {
          "name": "Matheus Cabral Uchôa",
          'phone': "31994883720",
          "email": "matheuscabralu1990@gmail.com",
          "document": "02235906656",      
          'address': "Rua José Gomes Ferreira",
          "complement": "",
          'number': "1011",
          "district": "Novo Amazonas",
          "city": "Betim",
          "country_id": "BR",
          "postal_code": "32684395",
          "note": ""
        },
        "to": {
          "name": userInfo.nome,
          "phone": userInfo.tel,
          "email": userInfo.email,
          "document": userInfo.cpf,
          "address": userInfo.rua,
          "complement": userInfo.complemento,
          "number": userInfo.numero,
          "district": userInfo.bairro,
          "city": userInfo.cidade,
          "state_abbr": userInfo.estado,
          "country_id": "BR",
          "postal_code": JSON.stringify(userInfo.cep),
          "note": "observação"
        }
      }

    
    var volumes = []
    
    shipInfo.packages.forEach(pack => {
        
        
        let volume = {
            "height": pack.dimensions.height,
            "width" : pack.dimensions.width,
            "length": pack.dimensions.length,
            "weight": pack.weight
        }
        volumes.push(volume)
    })   
    
      var payload4 = {

        "volumes": volumes
      }
      
      var insuranceValue = 0
      for (const iten in itensInfo) {
        var value = itensInfo[iten].preco
        insuranceValue += parseFloat(value.replace(',','.'))
        
          
      }

      var payload5 = {
            "options":{
                "insurance_value": insuranceValue,
                "receipt": false,
                "own_hand": false,
                "reverse": false,
                "non_commercial":true,
            }
        
      } 
 
     
      const menvBody = {...payload1,...payload2,...payload3,...payload4,...payload5}
      
      return menvBody
}
    
//!---------------------------------------------------------------------------------------------------------------------
async function shipCart(){
    let shipInfo = sessionStorage.getItem('shipInfo')

    //let shipInfo = SHIPINFO AQUI 

    if(shipInfo.id ===3 || shipInfo.id ===4){
        var menvBody = await buildMenvCorreiosPayload()
    }else{
        var menvBody = await buildMenvJadlogPayload()
    }
    
   /*  var options = {
        method:'POST',    
        headers:new Headers({'Content-Type': 'application/json'}),
        body:JSON.stringify(menvBody)
    } */

    var  result = await menvjs.shipCartReq(menvBody)
    console.log('result: ',result)
    console.log('result: ',JSON.stringify(result))
    return result
}
// valor do frete


async function apiPagseguro(){

    var token = sessionStorage.getItem('token')
    if(!token){
        Swal.fire({
            title: 'Você não está logado!',
            text: "Você precisa fazer login para continuar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Voltar',
            confirmButtonText: 'Fazer Login'
          }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Você será redirecionado para página de cadastro',
                    showConfirmButton: false,
                    timer: 3000
                  }).then(() => {
                    window.location.replace(`https://www.crialuth.com/signup`)
                  })
                
            }
          })
    }
    var pagSeguroBody = await buildPayload()
    console.log('pagSeguroBody',pagSeguroBody)
    var sessionToken = sessionStorage.getItem('token')
    
    
    var options = {
        method:'POST',    
        headers:{
                            'Content-Type': 'application/json',
                            'token':sessionToken
                            },
        body:JSON.stringify(pagSeguroBody)
    }
    
     console.log(JSON.stringify(options))

    var codigo = await fetch('https://www.crialuth.com/pagamento', options)
    console.log("🚀 ~ file: carrinho.js ~ line 571 ~ apiPagseguro ~ codigo", codigo)
    console.log(JSON.stringify(codigo)) 
    let jsonCode = await codigo.json()
    console.log("codigo:",jsonCode)
    
    

    if(codigo.error){
        console.log(codigo.error)
        window.alert('Você será redirecionado para o cadastro para concluir a compra!')
        
        window.location.replace(`https://www.crialuth.com/signup`)
    }
    
    //var json = await codigo.json()
    
          

    var parser = new DOMParser()
    var xmlDoc = parser.parseFromString(jsonCode,"text/xml")
    
 
    //Insira o código de checkout gerado no Passo 1    
    var code = xmlDoc.getElementsByTagName('code')[0].innerHTML;
    console.log('code:',jsonCode)
   
    var callback = {
        success : async function(transactionCode) {
            //Insira os comandos para quando o usuário finalizar o pagamento. 
            //O código da transação estará na variável "transactionCode"
             
            var shipping = await shipCart()
            console.log('resultado shipCart',shipping)
            console.log("Compra feita com sucesso, código de transação: " + transactionCode);
        },
        abort : function() {
            //Insira os comandos para quando o usuário abandonar a tela de pagamento.
            console.log("abortado");
        }
    };
    //Chamada do lightbox passando o código de checkout e os comandos para o callback
    var isOpenLightbox = PagSeguroLightbox(code, callback);
    // Redireciona o comprador, caso o navegador não tenha suporte ao Lightbox
    if (!isOpenLightbox){
        location.href="https://pagseguro.uol.com.br/v2/checkout/payment.html?code=" + code;
        //JA ESTA URL DE PRODUCAO DO PAGSEGURO
        console.log("Redirecionamento")

    }

}
var fechapedido = document.querySelector('#fechapedido')
fechapedido.addEventListener('click',apiPagseguro)
