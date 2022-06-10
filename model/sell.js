
const { Sequelize,Model,DataTypes} = require('sequelize');
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
}
//auth()



class TableTest extends Model {}

TableTest.init({
  // Model attributes are defined here
  nome: {
    type: DataTypes.STRING,
   
  },
  
},{sequelize, freezeTableName: true,timestamps: false,});

// the defined model is the class itself
console.log(TableTest === sequelize.models.TableTest); 

async function findAll(){
  
  var result = await TableTest.findAll()
  console.log(result)
}

findAll()

/* 
var mysql = require('mysql');

var con = mysql.createConnection({

  host: "127.0.0.1",
  user: "root",
  port:3306,
  password: "",
  database:"test"
  
});

con.connect(function(err) {
    if (err) throw err;
    console.log("connected")
  });
  

  var teste = con.query("SELECT * FROM testtable;",async function (err, result, fields) {
    if (err){ return err};

    console.log()
    console.log('result', await result);
    console.log('fields',fields)
    return {err,result,fields}
  });

  console.log(teste) */