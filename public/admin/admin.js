document.addEventListener('DOMContentLoaded',renderProds)

async function getProds(){
        
    var response = await fetch(`https://www.crialuth.com/all`)
    let prods = await response.json()

    return prods

}              

async function renderProds(){

    var prods = await getProds()
    console.log(prods)
    var prodsList = document.querySelector('#prodsList')
    prods.forEach(quadro => {
        prodsList.innerHTML +=`
    <li class="list-group-item">
        <div class="container">
            <div class="row">
              <div class="col">
                
                <div> <strong>ID:</strong> ${quadro.id}</div>
                <div>  <h6>${quadro.nome}</h6></div>
              
            </div>
              <div class="col">
                
                <div> <img class="img-thumbnail" src="${quadro.imagePath}" alt=""> </div>
                <div> </div>
              
            </div>
              <div class="col">
                
                <div>Maisvendido(0=não/1=sim):<br></div>
                <div><strong> ${quadro.categoria}</strong></div>
              
            </div>
              <div class="col">
                
                <div> <strong>${quadro.maisvendido}</strong></div>
                <div> <strong>${quadro.preco}</strong></div>

              </div>
            </div>
          </div>
    </li>
        `
    });

}

var submit = document.querySelector('#submitButton')
submit.addEventListener('click',sendQuadro)

var arrayQuadros = new Array()

async function sendQuadro(){

    let nome = document.querySelector('#quadroNome').value
    let categ = document.querySelector('#quadroCateg').value
    let url = document.querySelector('#quadroUrl').value
    let maisvendido = document.querySelector('#quadroMaisvend').value

    let quadroInfo= {
        nome,
        categ,
        url,
        maisvendido
    }
    arrayQuadros.push(quadroInfo)
    console.log(arrayQuadros)
    
}


async function adicionaQuadros(){
  
  console.log('arrayQuadro'+arrayQuadros)
  let options={
    method:'POST',
    headers:new Headers({'Content-Type': 'application/json'}),
    body:JSON.stringify(arrayQuadros)
  }

  let result = await fetch('http://localhost:21090/newprod',options)
  console.log(result)
  if (result.ok) {

    arrayQuadros.length = 0
  
  }
  return result

}

var send = document.querySelector('#sendButton')
send.addEventListener('click',adicionaQuadros)



async function delQuadros(){
  var delButton = document.querySelector('#delId').value
  console.log('arrayQuadro'+delButton)
  let options={
    method:'DELETE',
    headers:new Headers({'Content-Type': 'application/json'}),
  }

  let result = await fetch(`http://localhost:21090/delprod/${delButton}`,options)
  console.log(result)
  
  return result

}

var delButton = document.querySelector('#delButton')
delButton.addEventListener('click',delQuadros)