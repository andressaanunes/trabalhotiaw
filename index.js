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
})
*/

app.listen(PORT,(error)=>{
    console.log('Servidor na porta '+PORT)
    if (error) {
        console.log(error)
    }
})

app.use('/api',apiRoute)

/* app.use("/imagens",express.static(path.join(__dirname, "public", "imagens")))
app.use("/scripts",express.static(path.join(__dirname, "public", "scripts")))
app.use("/styles",express.static(path.join(__dirname, "public", "styles"))) */



app.use("/", express.static(path.join(__dirname,"public","Home")))
/* app.use("/banner",express.static(path.join(__dirname, "public", "Home", "banner")))
app.use("/slick-1.8.1",express.static(path.join(__dirname, "public", "Home", "slick-1.8.1"))) */

app.use("/carrinho", express.static(path.join(__dirname,"public", "carrinho")))

app.use("/sign-in/", express.static(path.join(__dirname,"public",'Sign-in')))

app.use("/sign-up/", express.static(path.join(__dirname,"public",'Sign-up')))

app.use(`/category`, express.static(path.join(__dirname,"public",'category')))

app.use(`/area`, express.static(path.join(__dirname,"public",'area')))

app.use(`/search`, express.static(path.join(__dirname,"public",'Search')))

app.use(`/product`, express.static(path.join(__dirname,"public",'produto')))





module.exports = app
    

