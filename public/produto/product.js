
document.addEventListener('DOMContentLoaded',()=>{
   var fbComents = document.querySelector('.fb-comments')
   var url = location.href

   fbComents.setAttribute("data-href", url)

})



document.addEventListener('DOMContentLoaded',()=>{getProds()})
prods = 'teste'

var formatter = new Intl.NumberFormat('pt-BR',{
    style:"currency",currency:"BRL"})


class Quadro{
    constructor(){}

    prodInfo(prod){
        this.nome = prod[0].nome
        this.id = prod[0].id
        this.preco = parseFloat(prod[0].preco)
        this.imagePath = prod[0].imagePath
    }
    parsePrice(){
        return formatter.format(this.preco)
    }

}
var quadro = new Quadro()

function getProds() {
    
    var params = location.href.split('=',2)
    
    fetch(`http://localhost:5000/api/product/${params[1]}`).then((res)=>{    
        
        return res.json()

    }).then((res) =>{
        
        prods = res
        
              
        quadro.prodInfo(prods)
        
        document.querySelector('#title').innerHTML = quadro.nome
        document.querySelector('#id').innerHTML = quadro.id
        document.querySelector('#image').setAttribute('src', quadro.imagePath)
        document.querySelector('#preco').innerHTML += quadro.parsePrice()
        
        })
        
    }

console.log(quadro.nome)
    $(document).ready(function(){
        var quantity = 1;
        $('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($('#quantity').val());
            
            $('#quantity').val(quantity + 1);
            
        });
    
        $('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($('#quantity').val());
            if(quantity > 1){
                $('#quantity').val(quantity - 1);
                
            }
        });
    
    });


var quantidade1 = document.querySelector('#quantitydiv')
    quantidade1.addEventListener(`click`,() =>{alteraPreco()})


var select = document.querySelector('#revest')
    select.addEventListener('change', () =>{alteraPreco()})


function alteraPreco(){
    var preco =  document.querySelector('#preco')
    console.log(preco)
    let quantidade1 = document.querySelector('#quantity').value
    console.log(quantidade1)

    let value = select.options[select.selectedIndex].value
    console.log(value)
    if (value == 2){
        
        let calculo = (quadro.preco + 10) * quantidade1
        console.log(calculo)
        preco.innerHTML = formatter.format(calculo)
        
    }else{

        let calculo = quadro.preco * quantidade1
        preco.innerHTML = formatter.format(calculo)
     }
}


var placaCheck = document.querySelector('#placaDeco')
placaCheck.addEventListener('change', placaDeco)

async function placaDeco(){

    var preco =  document.querySelector('#preco')

    if(placaCheck.checked == true){

        let revest = document.querySelector('#select1')
        let corMoldu = document.querySelector('#select2')
        revest.setAttribute('class','disabled')
        corMoldu.setAttribute('class','disabled')

        quadro.preco = 19.99
        preco.innerHTML = formatter.format(19.99)

    }else if(placaCheck.checked == false){
        let revest = document.querySelector('#select1')
        let corMoldu = document.querySelector('#select2')
        revest.setAttribute('class','')
        corMoldu.setAttribute('class','')

        quadro.preco = 44.99
        alteraPreco()
    }

}


var addCart = document.querySelector("#addCart")
addCart.addEventListener('click',cartIt)

function cartIt(){
    var nome = document.querySelector('#title').innerHTML
    //Product:
    var img = document.querySelector('#image').getAttribute('src')
    var preco = quadro.preco
    
    var id = document.querySelector('#id').innerHTML
    var quantity = parseInt(document.querySelector('#quantity').value)

    //var selected = document.querySelector('#revest') 
    console.log(placaCheck.checked)
    let type = placaCheck.checked == true ? 3 :  parseInt(select.options[select.selectedIndex].value)
    console.log(type)

    var select2 = document.querySelector('#molduraCor')
    
    var cor =  parseInt(select2.options[select2.selectedIndex].value)

    if (cor == 1) {
        cor = 'preto'
    
    }else if (cor ==2){
        cor = 'branco'
    
    }
    
    product = {
        nome,
        id,
        img,
        preco,
        quantity,
        type,
        cor,

    }
   
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    let itensInCart = sessionStorage.getItem('itensInCart')
    itensInCart = parseInt(itensInCart)
    

    if(cartItems != null){

        console.log('cartitems notnull')
        console.log(cartItems[nome])
        console.log(cartItems[nome].type)
            if(cartItems[nome].nome && cartItems[nome].type == undefined){

                cartItems = {
                    ...cartItems,
                    [nome]: product
                }
                console.log(product.quantity)
                sessionStorage.setItem('itensInCart',itensInCart + product.quantity)
                //itensInCart é o numero de produtos no carrinho
                
            }else if(cartItems[nome].nome == nome && cartItems[nome].type != type){

                console.log(cartItems[nome].nome)
                console.log(cartItems[nome].type)
                console.log(nome)
                console.log(type) 

                if (type == 2) {
                    nome = nome + ' (Vidro)'

                }else if(type == 3) {
                    nome = nome + '(Placa Decorativa)'
                
                }else if(type == 1) {
                    nome = nome + '(Acetato)'
                
                }
                cartItems = {
                    ...cartItems,
                    [nome]: product

                }
                console.log(product.quantity)
                sessionStorage.setItem('itensInCart',itensInCart + product.quantity)
                //itensInCart é o numero de produtos no carrinho

            }else{

                sessionStorage.setItem('itensInCart',itensInCart + product.quantity)
               
                cartItems[nome].quantity += product.quantity
                
            }


    }else{

        console.log('cartitems null')
        cartItems = new Array()
        cartItems.push(product)
        console.log(cartItems[0].nome)

        //!USAR METODOS .PUSH PARA ADICIONAR ITENS DIFERENMTES
       sessionStorage.setItem('itensInCart',parseInt(product.quantity))
       

    }        

    sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
    
    Swal.fire({
        title: 'Adicionado!',
        icon: 'success',
        timer:800,
      })
}

//!NOVA FUNÇÂO DE ADICIONAR ITEMS NO SESSIONSTORAGE

async function testecartItems(){

    let cartitems = JSON.parse(sessionStorage.getItem('cartItems'))
    console.log(cartitems)

    if (cartitems == null) {
        cartitems = new Array();
        cartitems.push({"testeNull":"testeNull"})
        
    }else if( cartitems!=null){
        cartitems.push({"testeNotNull":"testeNotNull"})

    }

    sessionStorage.setItem('cartItems',JSON.stringify(cartitems))
}