
document.addEventListener('DOMContentLoaded',getProds)
//document.addEventListener('DOMContentLoaded',loginCheck)


function getProds() {
    
    var params = location.href.split('=',2)

    fetch(`/category/${params[1]}`).then((res)=>{

        return res.json()
        
    }).then((res) =>{

        let prods = JSON.parse(res)
        
        prods.forEach(prod => {
            
            document.querySelector('#gridProds').innerHTML += `
            <div class="col-md-3">
            <div id= "columns" class="card h-100">
                <img class=" cardimg card-img-top" src="${prod.imagePath}" alt="Card image cap">
                <div class="card-body">
                    <h4 class="card-title"><a class="text-decoration-none" href="/produto
                    ?product=${prod.id}" title="View Product">${prod.nome}</a></h4>
                    <div class="align-text-bottom">
                        <span class="price"><strong>R$${prod.preco}</strong></span>
                    </div>
                </div>
                <div class="card-footer">
                    <a class="button" href="/produto?product=${prod.id}">Adicionar ao carrinho
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
    
    
   
    const prods = fetch(`/search/${busca}`).then((res)=>{    
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