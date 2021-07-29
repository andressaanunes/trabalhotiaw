
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
        console.log(prods)
              
        quadro.prodInfo(prods)
        console.log(quadro)
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


var addCart = document.querySelector("#addCart")
addCart.addEventListener('click',cartIt)

function cartIt(){
    var nome = document.querySelector('#title').innerHTML
    //Product:
    var img = document.querySelector('#image').getAttribute('src')
    var preco = quadro.preco
    
    var id = document.querySelector('#id').innerHTML
    var quantity = parseInt(document.querySelector('#quantity').value)
    
    product = {
        nome,
        id,
        img,
        preco,
        quantity,
        
    }
   
    let cartItems = sessionStorage.getItem('cartItems')
    let itensInCart = sessionStorage.getItem('itensInCart')
    itensInCart = parseInt(itensInCart)
    cartItems = JSON.parse(cartItems)
    

    if(cartItems != null){

        console.log('cartitems notnull')

            if(cartItems[nome] == undefined){

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
        cartItems = {

            [nome]:product

        }
       sessionStorage.setItem('itensInCart',parseInt(product.quantity))
       console.log(product.quantity)

    }        

    sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
    console.log(quadro)
    Swal.fire({
        title: 'Adicionado!',
        icon: 'success',
        timer:800,
      })
}
