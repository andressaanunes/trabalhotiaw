document.addEventListener('DOMContentLoaded',()=>{
   var fbComents = document.querySelector('.fb-comments')
   var url = location.href

   fbComents.setAttribute("data-href", url)

})



document.addEventListener('DOMContentLoaded',()=>{getProds()})


var formatter = new Intl.NumberFormat('pt-BR',{
    style:"currency",currency:"BRL"})


class Quadro{
    constructor(){}

    prodInfo(prod){
        this.nome = prod.nome
        this.id = prod.id
        this.precoUnit = parseFloat(prod.preco)
        this.preco = parseFloat(prod.preco)
        this.imagePath = prod.imagePath
        this.imageBranca = prod.imageBranca
        this.imagePlaca = parseFloat(prod.imagePlaca)
    }
    parsePrice(){
        return formatter.format(this.preco)
    }
    alteraPreco(price){
        
        this.preco = price
        document.querySelector('#preco').innerHTML = quadro.parsePrice()

    }
    alteraPrecoUnit(precoUnit){

        this.precoUnit = precoUnit
    
    }

}
var quadro = new Quadro()

function getProds() {
    
    var params = location.href.split('=',2)
    
    fetch(`https://www.crialuth.com/product?id=${params[1]}`).then((res)=>{    
        console.log(res)
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
    quantidade1.addEventListener(`click`,() =>{getNewPrice()})


var select = document.querySelector('#revest')
    select.addEventListener('change', () =>{getNewPrice()})


/*function alteraPreco(){
    var preco =  document.querySelector('#preco')
    
    let quantidade1 = document.querySelector('#quantity').value
    console.log(quantidade1)

    let value = select.options[select.selectedIndex].value
    console.log(value)
    if (value == 2){
        
        let calculo = (quadro.preco + 10) * quantidade1
        console.log(calculo)
        quadro.preco = calculo
        preco.innerHTML = formatter.format(calculo)
        document.querySelector('#image').setAttribute('src', quadro.imageBranca)
        
    }else{

        let calculo = quadro.preco * quantidade1
        quadro.preco = calculo
        preco.innerHTML = formatter.format(calculo)
        document.querySelector('#image').setAttribute('src', quadro.imagePath)
    }
}*/

async function precoTipo(){
    var placaCheck = document.querySelector('#placaDeco')
    if(placaCheck.checked == false){  

        if(select.options[select.selectedIndex].value == 2){

            quadro.alteraPreco(54.99)
            quadro.alteraPrecoUnit(54.99)
            
        }else{

            quadro.alteraPreco(44.99)
            quadro.alteraPrecoUnit(44.99)
        }

    }else{

        quadro.alteraPreco(19.99)
        quadro.alteraPrecoUnit(19.99)

    }
    console.log(quadro.preco)
}

function getNewPrice(){

    precoTipo()

    let quantidadeAtual = document.querySelector('#quantity').value
    console.log(quantidadeAtual)
    
    //let revestValue = (select.options[select.selectedIndex].value == 2) ? 10 : 0

    //console.log('Informações do quadro:',quantidadeAtual, revestValue)
    
    let newPrice = (quantidadeAtual * quadro.precoUnit) 

    console.log('Preço final:',newPrice) 
    
    quadro.alteraPreco(newPrice)
    console.log(quadro)

}



var placaCheck = document.querySelector('#placaDeco')
placaCheck.addEventListener('change', placaDeco)

async function placaDeco(){
    console.log(placaCheck.checked)


    if(placaCheck.checked == true){

        let revest = document.querySelector('#select1')
        let corMoldu = document.querySelector('#select2')
        revest.setAttribute('class','disabled')
        corMoldu.setAttribute('class','disabled')

        quadro.alteraPrecoUnit(19.99)
        getNewPrice()
        
        document.querySelector('#image').setAttribute('src', quadro.imagePlaca)

    }else if(placaCheck.checked == false){

        let revest = document.querySelector('#select1')
        let corMoldu = document.querySelector('#select2')
        revest.setAttribute('class','')
        corMoldu.setAttribute('class','')

        quadro.alteraPreco(49.99)
        getNewPrice()

        document.querySelector('#image').setAttribute('src', quadro.imagePath)

        
    }

}


var addCart = document.querySelector("#addCart")
addCart.addEventListener('click',cartIt)

function cartIt(){
     //Product:
    var nome = document.querySelector('#title').innerHTML
   
    var img = document.querySelector('#image').getAttribute('src')
    var preco = parseFloat(quadro.preco).toFixed(2)
    
    var id = document.querySelector('#id').innerHTML
    var quantity = parseInt(document.querySelector('#quantity').value)

    
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
        cor,
        img,
        preco,
        precoUnit:quadro.precoUnit,
        quantity,
        type,
    }
   
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    let itensInCart = parseInt(sessionStorage.getItem('itensInCart'))
   
    if (cartItems == null) {
        
        cartItems = new Array()
        cartItems.push(product)
        sessionStorage.setItem('itensInCart',parseInt(product.quantity))

    } else if(cartItems != null) {

        //procura o item
        
        let equalProd = cartItems.filter(cartProd => cartProd.nome == product.nome && cartProd.type == product.type && cartProd.cor == product.cor )
        
        if (equalProd.length > 0) {
            let eqProdIndex = cartItems.indexOf(equalProd[0])
            cartItems[eqProdIndex].quantity += product.quantity
            
        }else{
            cartItems.push(product)

        }

        sessionStorage.setItem('itensInCart',itensInCart + parseInt(product.quantity))

        //checka igualdade do item

        //se o item é igual adiciona quantidade

        //se o item nao é igual adiciona novo item
        
    }



    
    
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
    
    Swal.fire({
        title: 'Adicionado!',
        icon: 'success',
        timer:800,
      })
}
 /* 
    
    if(cartItems != null){
        let itemFiltered = cartItems.filter(produto => produto.preco == 3)
        console.log(itemFiltered)
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
       

    }         */
//!NOVA FUNÇÂO DE ADICIONAR ITEMS NO SESSIONSTORAGE

async function testecartItems(){

var arrayteste = [
    {cor: "preto",
    id: "36",
    img: "https://i.ibb.co/r5wSZn3/1-Quadro-Aqui-Reunimos-nossa-fam-lia-E-Amigos.png",
    nome: "Quadro Aqui Reunimos Nossa Família e Amigos",
    preco: 44.99,
    quantity: 1,
    type: 1,},
    {cor: "preto",
    id: "36",
    img: "https://i.ibb.co/r5wSZn3/1-Quadro-Aqui-Reunimos-nossa-fam-lia-E-Amigos.png",
    nome: "Quadro Aqui Reunimos Nossa Família e Amigos",
    preco: 44.99,
    quantity: 1,
    type: 1,},
]
 if(JSON.stringify(arrayteste[0]) === JSON.stringify(arrayteste[1])){
     console.log('é igualizado')
     console.log(JSON.stringify(arrayteste[1]))
 }
}