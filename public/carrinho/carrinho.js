

document.addEventListener('DOMContentLoaded',listProds)



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

   //nao finalizado

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

    

}
var fechapedido = document.querySelector('#fechapedido')
fechapedido.addEventListener('click',apiPagseguro)
