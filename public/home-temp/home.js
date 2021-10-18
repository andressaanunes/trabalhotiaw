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

//*-------------------------------------------------

var list = {



createProd(prod){

  
  var gridProds = document.querySelector('#gridProds')
  gridProds.innerHTML += `
          <div class="col-md-3">
          <div id= "columns" class="card h-100">
              <img class="cardimg card-img-top" data-src="${prod.imagePath}" alt="Card image cap" >
              <div class="card-body">
                  <h4 class="card-title"><a class="text-decoration-none" href="https://www.crialuth.com/produto?product=${prod.id}" title="View Product">${prod.nome}</a></h4>
                  <div class="align-text-bottom">
                      <span class="price"><strong>R$${prod.preco}</strong></span>
                  </div>
              </div>
              <div class="card-footer">
                  <a class="button" href="https://www.crialuth.com/produto?product=${prod.id}">
                  Adicionar ao carrinho
                  </a>
              </div> 
          </div>
          </div>`

},

pageBtn(){
  document.querySelector('.pageBtn').innerHTML=state.page
},

async update(){

    var prods = await getProds()
    console.log(prods)
    
    document.querySelector('#gridProds').innerHTML = ''

    let actualPage = state.page
    let start = actualPage*state.perPage
    let end = start + state.perPage
    
    const paginatedItems = prods.slice(start,end)
    
    list.pageBtn()
    paginatedItems.forEach(list.createProd)
    
}

}


const perPage = 32
const state = {

page:1,
perPage,
async totalPage(){
  let prods = await getProds()
  return Math.ceil(prods.length/perPage-1)
  },


} 

async function chamPromise(){
let promise = await state.totalPage()
return promise
}
console.log(state)




//Estado atual da lista


//define os botoes de controle
const controls = {

async next(){
  state.page++

  let lastPage = state.page > await state.totalPage()
  
  if(lastPage){
    state.page--
  } 
  list.update()

},
prev(){

  state.page--

  if(state.page<1){
    state.page++
  
  }
},
async goTo(page){

  if(page<1){
      page = 1
  }

  state.page = page
  
  if(page>await state.totalPage()){
    state.page = await state.totalPage()
  }

},
createListeners(){

  document.querySelector('.firstPage').addEventListener('click',()=>{
    controls.goTo(1)
    list.update()
  })
  document.querySelector('.prev').addEventListener('click',()=>{
    controls.prev()
    list.update()
  })
  document.querySelector('.next').addEventListener('click',()=>{
    controls.next()
    list.update()
  })
  document.querySelector('.lastPage').addEventListener('click',async ()=>{
    controls.goTo(await state.totalPage())
    list.update()
  })

}
}


//Lazy loading images
function onScroll(){
document.querySelectorAll('.cardimg').forEach((img,index)=>{
  
  if(img.getBoundingClientRect().top < window.innerHeight){
    img.src = img.getAttribute('data-src')
  }

})
}
window.addEventListener('scroll', onScroll)
//console.log(list.prods)

list.update()
controls.createListeners()

let result = chamPromise()
console.log(result)
