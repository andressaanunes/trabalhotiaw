document.addEventListener('DOMContentLoaded',()=>{
    getProds()
    loginCheck()
})



$('.carouselslick').slick({
    infinite: true,
    slidesToShow:4,
    slidesToScroll: 2,
    autoplay:true,
    autoplaySpeed:2000,
    arrows:true,
    centerMode: true,
    centerPadding:'2px',
    adaptativeWidth:true,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
})




function getProds() {
    
    const prods = fetch(`http://localhost:5000/api/`).then((res)=>{    
        

        return res.json()
    }).then((res) =>{

        let prods = JSON.parse(res)
        
        prods.forEach(prod => {
            
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
                    <a class="button" href="http://localhost:5000/product?product=${prod.id}">
                    Adicionar ao carrinho
                    </a>
                </div> 
            </div>
        </div>`
        });

        
    })

    





}



