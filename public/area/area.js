
document.addEventListener('DOMContentLoaded',getProds)
document.addEventListener('DOMContentLoaded',loginCheck)

async function loginCheck() {

    var token = sessionStorage.getItem('token')
    console.log(token)
    if( token ){
        var button = document.querySelector('#button-addon2')
        button.innerHTML = "Logado!"
    }
}


//const busca = document.querySelector('#busca')
//busca.addEventListener('click', redirect)

function redirect(){
    window.location.replace(`http://localhost:21090/search/?search=${search.value}`)
}


function getProds() {
    
    var params = location.href.split('=',2)

    fetch(`http://localhost:21090/api/area/${params[1]}`).then((res)=>{
        console.log(res)
        return res.json()
        
    }).then((res) =>{

        let prods = JSON.parse(res)
        console.log(prods)
        prods.forEach(prod => {
            
            document.querySelector('#gridProds').innerHTML += `
            <div class="col-md-3">
            <div id= "columns" class="card h-100">
                <img class=" cardimg card-img-top" src="${prod.imagePath}" alt="Card image cap">
                <div class="card-body">
                    <h4 class="card-title"><a class="text-decoration-none" href="http://localhost:21090/product?product=${prod.id}" title="View Product">${prod.nome}</a></h4>
                    <div class="align-text-bottom">
                        <span class="price"><strong>R$${prod.preco}</strong></span>
                    </div>
                </div>
                <div class="card-footer">
                    <a class="button" href="http://localhost:21090/product?product=${prod.id}">Adicionar ao carrinho
                    </a>
                </div> 
            </div>
        </div>`
        });
   
    })
}

/* var search = document.querySelector('#homesearch')
search.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        busca.click();
    }
}); */

function searchProds() {
    
    
   
    const prods = fetch(`http://localhost:21090/api/search/${busca}`).then((res)=>{    
        console.log(prods)
        console.log(res)

        
        

        return res.json()
    }).then((res) =>{

        let prods = JSON.parse(res)
        
        prods.forEach(prod => {
            console.log(`resposta é: ${prod.id,prod.nome} `)
            document.querySelector('#gridProds').innerHTML += `<div class="col-md-3">
            <div id= "columns" class="card">
                <img class=" cardimg card-img-top" src="${prod.imagePath}" alt="Card image cap">
                <div class="card-body">
                    <h4 class="card-title"><a href="product.html" title="View Product">${prod.nome}</a></h4>
                    <span class="price">${prod.preco}</span>
                    <div class="row">
                        <div class="col">
                            <a class="button" href="#">Adicionar ao carrinho</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        });

    })

}