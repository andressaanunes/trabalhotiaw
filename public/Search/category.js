
document.addEventListener('DOMContentLoaded',()=>{
    getProds()
    
})


function getProds() {
    
    var params = location.href.split('=',2)
    console.log(params[1])
    const prods = fetch(`http://localhost:5000/api/search/${params[1]}`).then((res)=>{    
        console.log(prods)
        console.log(res)

        
        

        return res.json()
    }).then((res) =>{

        let prods = JSON.parse(res)
        
        prods.forEach(prod => {
            console.log(`resposta é: ${prod.id,prod.nome} `)
            document.querySelector('#gridProds').innerHTML += `
            <div class="col-md-3">
            <div id= "columns" class="card h-100">
                <img class=" cardimg card-img-top" src="${prod.imagePath}" alt="Card image cap">
                <div class="card-body">
                    <h4 class="card-title"><a class="text-decoration-none" href="http://localhost:5000/product?product=${prod.id}" title="View Product">${prod.nome}</a></h4>
                    <div class="align-text-bottom">
                        <span class="price"><strong>R$${prod.preco}</strong></span>
                    </div>
                </div>
                <div class="card-footer">
                    <a class="button" href="http://localhost:5000/product?product=${prod.id}">Adicionar ao carrinho
                    </a>
                </div> 
            </div>
        </div>`
        });

        
    })

    





}