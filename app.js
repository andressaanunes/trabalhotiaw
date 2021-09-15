require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const apiRoute = require('./routes/api')
const cors = require('cors')
const PORT = process.env.PORT

const app = new express()




app.use(cors())

app.use('/api',apiRoute)

app.use('*',(req,res,next) => {
    res.header ("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    /* if(req.headers['x-forwarded-proto']=='https'){
        next()

    }else if(req.originalUrl == "/"){
        res.redirect("https://"+req.headers.host + req.originalUrl+"home/")

    } else{
        res.redirect("https://"+req.headers.host + req.originalUrl)
    } 
 */next()
    })



app.use('/', express.static(path.join(__dirname, "public")))



app.listen(PORT,(error)=>{
    console.log('Servidor na porta '+PORT)
    if (error) {
        console.log(error)
    }
})

module.exports = app