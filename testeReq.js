const axios = require('axios')
module.exports = async function testeReq(){
    try {
      let resp = await axios('https://ipinfo.io/ip') 
      console.log(resp)
      return resp
    } catch (error) {
      console.log(error)
      
    }
  }
  
