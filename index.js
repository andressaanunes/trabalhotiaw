require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const apiRoute = require('./routes/api')
const cors = require('cors')

const PORT = process.env.PORT

const app = new express()


app.use(cors())
/*app.use('*',(Req,res,next) => {
    if(req.headers['x-forwarded-proto']=='https'){
        next()
    }else{
        res.redirect("https://"+req.headers.host + req.originalUrl)
    }
})*/

app.listen(PORT,(error)=>{
    console.log('Servidor rodando na porta '+PORT)
    if (error) {
        console.log(error)
    }
})

app.use('/api',apiRoute)

app.use(express.static("public"))

app.use("/", express.static(path.join(__dirname,"public","Home")))

app.use("/carrinho", express.static(path.join(__dirname,"public", "carrinho")))

app.use("/sign-in/", express.static(path.join(__dirname,"public",'Sign-in')))

app.use("/sign-up/", express.static(path.join(__dirname,"public",'Sign-up')))

app.use(`/category`, express.static(path.join(__dirname,"public",'category')))

app.use(`/area`, express.static(path.join(__dirname,"public",'area')))

app.use(`/search`, express.static(path.join(__dirname,"public",'Search')))

app.use(`/product`, express.static(path.join(__dirname,"public",'produto')))





module.exports = app
    

