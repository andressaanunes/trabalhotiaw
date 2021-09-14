document.addEventListener('DOMContentLoaded',()=>{
    loginCheck
})

async function loginCheck() {

    var token = sessionStorage.getItem('token')
    console.log(token)
    if( token ){
        var button = document.querySelector('#button-addon2')
        button.innerHTML = "Logado!"
    }
}

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
        
        await fetch('https://www.crialuth.com/api/login',config)
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