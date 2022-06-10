const db = require('./Db')

db.sequelize.authenticate().then(()=>{
    console.log('conectado com sucesso (products)')
}).catch((erro)=>{
    console.log('falha ao se conectar:' +erro)
})

const products = db.sequelize.define('products',{

    cod_livro:{type:db.Sequelize.INTEGER},
    quantidade:{ type: db.Sequelize.INTEGER},
    nome_autor:{type:db.Sequelize.STRING(50)},
    nome_livro:{ type:db.Sequelize.STRING(50)},
    descricao:{type:db.Sequelize.STRING(50)},
    valor:{type: db.Sequelize.INTEGER}, 
    
},{tableName:'products',timestamps: false,})


/* try{
    products.sync( {alter:true} )
}catch(error){
        console.log(error)
    } */
module.exports = products


