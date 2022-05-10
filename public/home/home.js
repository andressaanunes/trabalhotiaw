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
        
        var response = await fetch(`https://www.crialuth.com/all`)
      let prods = await response.json()
      
      return prods

    }                                                             

