const db = require('../model/Db')

db.sequelize.authenticate().then(()=>{
    console.log('conectado com sucesso (users)')
}).catch((erro)=>{
    console.log('falha ao se conectar:' +erro)
})

const users = db.sequelize.define('users',{
    nome:{ type:db.Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty: true,
        }
    },
    email:{ type: db.Sequelize.STRING,
        allowNull:false,
        validate:{        
        isEmail: true,
        notNull:true,
        notEmpty: true,}
    },
    tel:{type:db.Sequelize.STRING,
        allowNull:false,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    cpf:{type:db.Sequelize.STRING,
        allowNull:false,
        unique:true,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    senha:{type:db.Sequelize.STRING,
        allowNull:false,
        unique:true,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    cep:{type:db.Sequelize.INTEGER,
        allowNull:false,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    estado:{type:db.Sequelize.STRING,
        allowNull:false,
        validate:{      
            notNull:true,
            notEmpty: true,
        }
    },
    cidade:{type:db.Sequelize.STRING,
        allowNull:false,
        validate:{        
            notNull:true,
            notEmpty: true,
            }
    },
    bairro:{type:db.Sequelize.STRING,
        allowNull:false,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    rua:{type:db.Sequelize.STRING,
        allowNull:false,
        validate:{        
            notNull:true,
            notEmpty: true,
        }
    },
    numero:{type:db.Sequelize.INTEGER,
        allowNull:false,
        validate:{              
            notNull:true,
            notEmpty: true,
        }
    },
    complemento:{type:db.Sequelize.STRING,
        allowNull:true     
    }
    
})
////////////////////////////////users.sync({force:true})
module.exports = users

