// require('../controllers/users')

//const { options } = require("request")

document.addEventListener('DOMContentLoaded',()=>{
    loginCheck
    
})

document.addEventListener('DOMContentLoaded',()=>{
    userIsAdmin()
})

/*async function testeReq(){
    options = {
        headers:{'Content-Type': 'application/json'},
        method:'POST',
        body: JSON.stringify({"id":1,
                "nome":"Kayro Danyell",
                "email":"kayrodanyell@gmail.com",
                "tel":"31988849634",
                "cpf":"56140835615",
                "cep":30662523,
                "estado":"MG",
                "cidade":"Belo Horizonte",
                "bairro":"Itaipu (Barreiro)",
                "rua":"Rua Taiwan",
                "numero":130,
                "complemento":"Casa",
                "isAdmin":1,"createdAt":"2021-05-14T01:50:26.000Z","updatedAt":"2021-05-14T01:50:26.000Z"})
    }

    let userResult = await fetch('https://www.crialuth.com/userId',options)
    let josn = await userResult.json() 
            //const userResult = await users.getUser(userId.id)
            console.log('userResult'+josn)
            console.log('userResult'+JSON.stringify(josn))
            
        }

testeReq()*/

/*async function loginCheck() {
    userIsAdmin
    var token = sessionStorage.getItem('token')
    console.log(token)
    if( token ){
        var button = document.querySelector('#button-addon2')
        button.innerHTML = "Logado!"
    }
}*/

/*async function userIsAdmin(){

    const userId = localStorage.getItem('userInfo')
    

    if (userId.id) {
        
        options = {
            headers:{'Content-Type': 'application/json'},
            method:'POST',
            body: JSON.stringify(userId)
        }
        let userResult = await fetch('https://www.crialuth.com/userId',options)

        //const userResult = await users.getUser(userId.id)
        console.log('userResult'+JSON.stringify(userResult))

        let json = userResult.json()

        if(json === undefined){

            if (json === 1) {
                
              document.querySelector('#adminBtn').innerHTML = `
                < id="adminBtn" button>admin</button>
              ` 
            }else{console.log('nao admin')}

        }else{console.log('usuario nao encontrado')}

    }else{console.log('não logado')}


}*/

async function userIsAdmin(){
    console.log('chegou userIsAdmin')
    const userId = JSON.parse(localStorage.getItem('userInfo'))
    console.log(userId.id)

    if (userId.id) {
        console.log('chegou primeiro if pra buscar api')
        options = {
            headers:{'Content-Type': 'application/json'},
            method:'POST',
            body: JSON.stringify(userId)
        }

        let userResult = await fetch('https://www.crialuth.com/userId',options)
        let json = await userResult.json()
        //const userResult = await users.getUser(userId.id)

        console.log('userResult'+json.isAdmin)
        
        console.log('userResult'+JSON.stringify(json))
    
 
        if(!json.error){
           console.log('chegou if != undefined')
            if (json.response === 1) {

                console.log('chegou if usuario admin')
                let divbotao = document.getElementById('adminBtn')
                console.log(divbotao)
                divbotao.innerHTML = `
                <button id="adminBtn" >admin</button>` 

            }else{console.log('nao admin')}

        }else{console.log('usuario nao encontrado')}

    }else{console.log('sem userId.id não logado')}
}



async function getAdmin(){
    const userId = JSON.parse(localStorage.getItem('userInfo'))
    console.log('getAdmin :'+ userId.id)
    
    window.location.replace(`https://www.crialuth.com/admin/${userId.id}`)
}

let adminBtn = document.querySelector('#adminBtn')
adminBtn.addEventListener('click',getAdmin)



const loginBtn = document.querySelector('#login')
loginBtn.addEventListener('click', login)

async function login(){

    var email = document.querySelector('#email').value
    var password = document.querySelector('#password').value

    var user = {
        email,
        password
    }
    
    const config = {
    
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(user)
    
    }
    try {
        
        await fetch('https://www.crialuth.com/login',config)
        .then(async (response) => {

            if (response.status === 200){

                var token = response.headers.get('token')
                sessionStorage.setItem('token', token)
                response = await response.json()
                localStorage.setItem('userInfo',JSON.stringify(response.user))
                window.location.replace('https://www.crialuth.com/home/')
            
            }else{

                var span = document.querySelector('#error')
                span.innerHTML=''
                var erro =  await response.json()
                span.innerHTML = erro.error
            }
        })
    } catch (error) {
        console.log(error)
        
    }
}


async function testeFetch(){
    console.log('disparou fecth') 
    var options = {
        method: 'POST',
         headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({"teste":"teste!"})
    }

    var res = await fetch('https://www.crialuth.com/login',options)
    console.log("🚀 ~ file: signup.js ~ line 100 ~ testeFetch ~ res", res)
    
}//  /area?area=sala