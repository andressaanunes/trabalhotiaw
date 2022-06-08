document.addEventListener('DOMContentLoaded',()=>{
    
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


//pega os produtos no banco de dados

//*PARA PROMISE FUNCIONAR A REQUISIÃ‡ÃƒO DEVE SER EXECUTADA DENTRO DE UMA FUNÃ‡ÃƒO, O RESULTADO DA FUNÃ‡ÃƒO DEVE SER ATRIBUIDO A UMA VARIAVEL COMO MOSTRADO ABAIXO

    async function getProds(){
        
        var response = await fetch(`/all`)
        
      let prods = await response.json()
      console.log(prods)
      var gridProds = document.querySelector('#gridProds')
      prods.forEach(prod => {
        gridProds.innerHTML += `
          <div class="col-md-3">
          <div id= "columns" class="card h-100">
              <img class="cardimg card-img-top" src="./${prod.cod_livro}.jpg" alt="Card image cap" >
              <div class="card-body">
                  <h4 class="card-title"><a class="text-decoration-none" href="/produto?product=${prod.id}" title="View Product">${prod.nome_livro}</a></h4>
                  <div class="align-text-bottom">
                      <span class="price"><strong>R$${prod.valor}</strong></span>
                  </div>
              </div>
              <div class="card-footer">
                  <a class="button" href="/produto?product=${prod.id}">
                  Adicionar ao carrinho
                  </a>
              </div> 
          </div>
          </div>`
      });
      return prods

    } 
    getProds()                        
                               
