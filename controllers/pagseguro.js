

var body = {
    'email':'matheuscabralu1990@gmail.com',
    'token':'624D56DA97BD488A83E24D46034DC0C2', 
    'currency':'BRL',
    'itemId1':'0001',
    'itemDescription1':'Notebook Prata',
    'itemAmount1':'24300.00',
    'itemQuantity1':'1',
    'itemWeight1':'1000',
    'shippingAddressRequired':'true'
    }
async function pagseguro(){
    var searchParams = new URLSearchParams(body)
    var bodyForm = searchParams.toString()
    const options ={ 
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: bodyForm
    }
    try {
        const transaction = fetch('https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=matheuscabralu1990@gmail.com&token=624D56DA97BD488A83E24D46034DC0C2',options).then((req,res) => {
        console.log(res)
        console.log(transaction)
        return response.json()
    })
    } catch (error) {
        console.log(error)
    }
    
}

var body = {
    
    'email':'matheuscabralu1990@gmail.com',
    'token':'624D56DA97BD488A83E24D46034DC0C2', 
    'currency':'BRL',
    'itemId1':'0001',
    'itemDescription1':'Notebook Prata',
    'itemAmount1':'24300.00',
    'itemQuantity1':'1',
    'itemWeight1':'1000',
    'reference':'REF1234',
    'senderName':'Jose Comprador',
    'senderAreaCode':'11',
    'senderPhone':'56273440',
    'senderEmail':'c42884705204513279128@sandbox.pagseguro.com.br',
    'shippingType':'1',
    'shippingAddressRequired':'true',
    'shippingAddressStreet':'Av. Brig. Faria Lima',
    'shippingAddressNumber':'1384',
    'shippingAddressComplement':'5o andar',
    'shippingAddressDistrict':'Jardim Paulistano',
    'shippingAddressPostalCode':'01452002',
    'shippingAddressCity':'Sao Paulo',
    'shippingAddressState':'SP',
    'shippingAddressCountry':'BRA',
    'paymentMethodGroup1':'CREDIT_CARD',
    'paymentMethodConfigKey1_1':'MAX_INSTALLMENTS_NO_INTEREST',
    'paymentMethodConfigValue1_1':'6'
}



module.exports = {pagseguro: pagseguro}