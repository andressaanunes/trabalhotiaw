const Sequelize = require('sequelize')
const sequelize = new Sequelize('crialuth', 'crialuth1', 'K4this78', {host:'mysql742.umbler.com',
port:41890,
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
