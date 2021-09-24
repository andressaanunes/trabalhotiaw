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

    
var apiTokens = sequelize.define('apiTokens',{

    api:{ type:Sequelize.STRING,
    allowNull:false
    },
    token:{ type: Sequelize.STRING(1000),
    allowNull:false
    },
    refreshToken:{type: Sequelize.STRING(1000)}, 
    expDate:{type:Sequelize.DATEONLY},
    
})

//apiTokens.sync()


module.exports = { 
    apiTokens:apiTokens,
    Sequelize: Sequelize,
    sequelize: sequelize
}
