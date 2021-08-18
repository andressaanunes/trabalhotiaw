const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, 
{host:process.env.DB_HOST,
port:3306,
dialect: 'mysql'
})

sequelize.authenticate().then(()=>{
    console.log('conectado com sucesso')
}).catch((erro)=>{
    console.log('falha ao se conectar:' +erro)
})


module.exports = { 
    Sequelize: Sequelize,
    sequelize: sequelize
}
