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
    
    //console.log('TOKEN = '+ token)
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
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
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

    var httpsagent = {
      'host': `www.melhorenvio.com.br`,
      'port': '443',
      'path': `/api/v2/me/shipment/app-settings`,
      'rejectUnauthorized': false,
      //'ca': [ fs.readFileSync('server-cert.pem') ],
      checkServerIdentity: function (host, cert) {
        return undefined; 
      }
    }

    var options = {
      'method': 'GET',
      'url': `https://www.melhorenvio.com.br/api/v2/me/shipment/app-settings`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIxMTAzYWZiNGJhNWY5N2U0ZWE1ZGVhZWUwODE3YzczZGU2ZmYzMGQ1NThhZDM1MGVmOWIyZWU4N2VjZjk0OGFlNTcxNjg2YTZhODVmZDVmIn0.eyJhdWQiOiI2NjI3IiwianRpIjoiYjExMDNhZmI0YmE1Zjk3ZTRlYTVkZWFlZTA4MTdjNzNkZTZmZjMwZDU1OGFkMzUwZWY5YjJlZTg3ZWNmOTQ4YWU1NzE2ODZhNmE4NWZkNWYiLCJpYXQiOjE2NDQyNzkyMzQsIm5iZiI6MTY0NDI3OTIzNCwiZXhwIjoxNjQ2ODcxMjM0LCJzdWIiOiJmODQyZjAxNy0zZjc1LTRkZDAtOGJkYi03NDkyNTU2MzkwMzciLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIl19.xTnO_jESNHmjCWyuX20-OZdYlSG3-F7XcGI1S52qoQuwqiu70w5K6Tjs3qpy76FPkB5mRdO5HUEASfpIYQAgRy8e-KlU9Cm0IVd7ddwNyfg2ll0-h96e2NYLRqbohEQAuWUbDrtRmbkmU-kcx3ZuQ4MJlT4sM5HwH3sfTvQ-DGXGRibbJixHWlxBorG3u5Yh62288VETJ0Vt7vPCFqXkRWfY0SiGfrEpmvxsXxAN0VeUKkeZQDuplpBaJrgWnhRv4fstM56r3cOR8dO6vkcnfNilmjYFH2kBZTJbQFpV8TMC207NWZ4v2t6RJ7qciGmA04Qf52fetzeF3OsCM5uDmESm9Cp3QtYxWN_Rcb2QVnq_uT13j5hHjjzQMg7uGjoK4WXpI_kg5tRLnmwhF1Y5XkVjJPf0LWryP1ZsGjABCTY4oznkEPD6DT5ae0MXIZlcWv16m8OODQFdFEBMjHa-VSlUTvLQ_eYJT1URx0x0mOjltyVPCigWknQVGFVfXNVtMO2Wcwtr_0QEdkCUsWUPdmS7PNlOL12ThMYOwSLUH1s7tHXj7550CRY4Y_MbZ1-EwahcJ7CMbtkjsgnBEPFOqzxY14px3zTRIT4BkcQULZ1fs5ihtNZHWmRskVjySlnb1O3UgN7wq94jgYQgjoTAyNA1hvak-Cy3VnkMIGu5krw`,
        'User-Agent': 'CriaLuth kayrodanyell@gmail.com'
      },
      
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
      }).strictSSL(false)
    .end(function (res) { 
        if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
      });

  }
}

module.exports = MontaReqs

/*{ Error: Hostname/IP doesn't match certificate's altnames: "Host: (URL). is not in the cert's altnames: DNS:*.sa-east-1.es.amazonaws.com"
  at Object.checkServerIdentity (tls.js:223:17)
  at TLSSocket.<anonymous> (_tls_wrap.js:1111:29)
  at emitNone (events.js:106:13)
  at TLSSocket.emit (events.js:208:7)
  at TLSSocket._finishInit (_tls_wrap.js:639:8)
  at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
reason: 'Host: (URL). is not in the cert\'s altnames: DNS:*.sa-east-1.es.amazonaws.com',
host: '(URL)',
cert:  (certificate array)*/