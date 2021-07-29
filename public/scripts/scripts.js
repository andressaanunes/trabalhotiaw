document.addEventListener('DOMContentLoaded',()=>{
    loginCheck()
})



async function loginCheck() {

    var token = sessionStorage.getItem('token')
    
    if( token ){
        console.log('logged')
        var button = document.querySelector('#logged')
        button.innerHTML = "Logado!"
        var loginStyle = document.querySelector(".logged")
        loginStyle.setAttribute("style","position:relative, top:20px;")
    }
}


var search = document.querySelector('#homesearch')

search.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        busca.click();
    }
});


const busca = document.querySelector('#busca')
busca.addEventListener('click', redirect)

function redirect(){
    window.location.replace(`http://localhost:5000/search/?search=${search.value}`)
}