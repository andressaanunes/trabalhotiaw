// SALVAR O NOME E O ENDEREÇO DO CLIENTE NO LOCALSTORAGE 

submit.addEventListener('click',saveUser)


var clientCEP = document.querySelector('#cep')
clientCEP.addEventListener('blur',takeAddress)

async function takeAddress(){

    let search = clientCEP.value.replace("-","")

    var options ={
        method:'GET',
        mode:'cors',
        cache:'default'
    }
    
    var res = await fetch(`https://viacep.com.br/ws/${search}/json/`,options)
    res = await res.json()
   
    for(const campo in res){
        if(document.querySelector("#"+campo)){
            document.querySelector("#"+campo).value = res[campo]
        }
    }
}


// SALVAR O NOME E O ENDEREÇO DO CLIENTE NO LOCALSTORAGE, E NO BANCO POSTERIORMENTE
async function saveUser(){
    
    //SALVAR USUARIO NO LOCALSTORAGE

    var cpf = document.querySelector("#cpf").value
    cpf = cpf.replace(/[.-]/g,'')
    
    var cep = document.querySelector("#cep").value
    cep = cep.replace("-",'')

    var tel = document.querySelector("#tel").value
    tel = tel.replace(/[()-]/g,'')
    
    var userInfo ={
        nome: document.querySelector("#username").value,
        email: document.querySelector("#email").value,
        senha: document.querySelector("#password").value,
        tel,
        cpf,
        cep,
        estado: document.querySelector("#uf").value,
        cidade: document.querySelector("#localidade").value,
        bairro: document.querySelector("#bairro").value,
        rua: document.querySelector("#logradouro").value,
        numero: document.querySelector("#numero").value,
        complemento: document.querySelector("#complemento").value,
    } 

    var divErro = document.querySelector('#error')
    divErro.innerHTML=""
    //ENVIAR PRO BANCO
   try { 

        var config = {
            method: "POST",
            headers: new Headers({"Content-Type" : "application/json"}),
            body: JSON.stringify(userInfo)
        }

        var res = await fetch('http://localhost:21090/api/cadastro',config)
        
        var parsedRes = await res.json()
        parsedRes = JSON.parse(parsedRes)
        console.log( "res:" + parsedRes)
        if(res.status == 400){
           
           divErro.innerHTML = parsedRes.error
        }else{
            
            localStorage.setItem('userInfo',JSON.stringify(res.user))
        }
        
        
            
    } catch (error) {
        //!CONFIGURA A MENSAGEM DE ERRO NO CADASTRO
        console.log(error)

    }
 
}