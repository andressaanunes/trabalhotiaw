const db = require('../model/Db')

db.sequelize.authenticate().then(()=>{
    console.log('conectado com sucesso (products)')
}).catch((erro)=>{
    console.log('falha ao se conectar:' +erro)
})

const products = db.sequelize.define('products',{

    nome:{ type:db.Sequelize.STRING},
    categoria:{ type: db.Sequelize.STRING},
    preco:{type: db.Sequelize.INTEGER}, 
    maisvendido:{type:db.Sequelize.SMALLINT},
    imagePath:{type:db.Sequelize.STRING},
    imageBrancaPath:{type:db.Sequelize.STRING},
    placaDecoPath:{type:db.Sequelize.STRING}
    
})

////////////////////////////////products.sync({alter:true})
module.exports = products


