const axios = require('axios');
const melhorEnvioSdk = require('melhor-envio')
const sequelize = require('../model/Db')
const apiTokens = sequelize.apiTokens
const dayjs = require('dayjs');
const { Sequelize } = require('../model/Db');
const FormData = require('form-data');
//const ipInfo = require('../testeReq')
const https = require('https')
var https1 = require('follow-redirects').https;
var fs = require('fs');
var request = require('request');
var unirest = require('unirest');

class MontaReqs{
  
  constructor(){
    this.url = 'https://www.melhorenvio.com.br'  
    this.user_agent = 'CriaLuth kayrodanyell@gmail.com'
    this.client_id= '6627'
    this.client_secret= 'YzXJzwPgW7qy2409KLRqNGPbjwjGnGsvWhkgJbJK'
    this.sandbox= false
    this.bearer;
    this.redirect_uri= 'https://www.crialuth.com/shiptoken'
    this.scope='cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write'

  }
  async init() {

    let token = await apiTokens.findAll({
      where: {
          api: "menv"
          }
      }).then(res => {
        console.log('res',res)
        return res[0]
      })
    
    console.log('TOKEN = '+ token)
    //await checkTokenExp()
    //console.log(token)
    //console.log(token.dataValues.expDate)
    this.bearer = token.token
  }

  async appInfo(){

    var config = {
      method: 'get',
      url: `${this.url}/api/v2/me/shipment/app-settings`,
      headers: { 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${this.bearer}`, 
        'User-Agent': this.user_agent
      }
    };
    
    var response = await axios(config)
    console.log('RESPOSTA AXIOS: '+JSON.stringify(response.data));
    //return JSON.stringify(response.data)
    /*.then(function (response) {
      console.log('RESPOSTA AXIOS: '+JSON.stringify(response.data));
      return response.data
    })
    .catch(function (error) {
      console.log('ERROR>'+error);
    });*/

  }

  async getAppInfoHttps(){

    var options = {
      'method': 'GET',
      'hostname': this.url,
      'path': '/api/v2/me/shipment/app-settings',
      'headers': {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.bearer}`,
        'User-Agent': this.user_agent
      },
      'maxRedirects': 20
    };
    
    var req = await https.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        console.log('CHUNK'+chunk)
        chunks.push(chunk);
        console.log('CHUNKS'+chunks)
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log('BODY'+body.toString());
      });
    
      res.on("error", function (error) {
        console.error('ERROR'+error);
      });
    });
    
    console.log('REQ'+req)
    return req
      //TESTAR REQUISIÇÕES COM REQUISIÇÃO GET DE LISTAR INFORMAÇÕES DO APLICATIVO
  }

  async getAppInfoRequest(){

    var options = {
      'method': 'GET',
      'url': `${this.url}/api/v2/me/shipment/app-settings`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.bearer}`,
        'User-Agent': this.user_agent
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
  }

  async getAppInfoUnirest(){

      var req = unirest('GET', `${this.url}/api/v2/me/shipment/app-settings`)
    .headers({
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.bearer}`,
        'User-Agent': this.user_agent
      })
    .end(function (res) { 
        if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
      });

  }
}

module.exports = MontaReqs