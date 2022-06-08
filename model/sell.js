/* const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('test', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
  });

  async function auth(){

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  //sequelize.close()

  

    const User = sequelize.define('User', {
        // Model attributes are defined here
        firstName: {
        type: DataTypes.STRING,
        allowNull: false
        },
        lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
        }
    }, {
        // Other model options go here
    });

    
    const products = sequelize.define('products',{

        cod_livro:{type:DataTypes.INTEGER},
        quantidade:{ type: DataTypes.INTEGER},
        nome_autor:{type:DataTypes.STRING(50)},
        nome_livro:{ type:DataTypes.STRING(50)},
        descricao:{type:DataTypes.STRING(50)},
        valor:{type: DataTypes.INTEGER}, 
        
    },{sequelize,modeName:'products',tableName:'products'})
    
    // `sequelize.define` also returns the model
    console.log(User === sequelize.models.User);
    console.log(sequelize.models)

   let prods = await products.findAll()
   console.log(prods)
}
auth();


 */




var mysql = require('mysql');

var con = mysql.createConnection({

  host: "127.0.0.1",
  user: "root",
  port:3306,
  password: "",
  database:"phpmyadmin"
  
});

con.connect(function(err) {
    if (err) throw err;
    console.log("connected")
  });

  var teste = con.query("SELECT * FROM pma_bookmark;",async function (err, result, fields) {
    if (err){ return err};

    console.log()
    console.log('result', await result);
    console.log('fields',fields)
    return {err,result,fields}
  });

  console.log(teste)