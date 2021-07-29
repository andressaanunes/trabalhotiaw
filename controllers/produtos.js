const db = require('../model/Db')
const products =  db.Sequelize.Op
const produtos = require('../model/products')



async function getAllProducts(){ 
  let prods = await produtos.findAll()
  let json = JSON.stringify(prods)
  return json
}

async function searchProduct(search){
  
  const prods = await produtos.findAll({
    where: {
      [products.or]: {
       nome : { [products.like] : '%' + search + '%' },
       categoria : { [products.like]: '%' + search + '%' },
       preco : { [products.like]: '%' + search + '%' },
       categoria : { [products.like]: '%' + search + '%' },
      }
    }
  });
  let json = JSON.stringify(prods)
  
  return json
}

async function getProductById(Id){
  let prods = await produtos.findAll({
    where: {
      id: Id
    }
  })
  let json = prods
  return json
};

async function getProductBolotas(IdArray){

  let quads = await getProductById(IdArray)

  //console.log(quads)

  return JSON.stringify(quads)

};

async function getProductByCategory(Category){

  let prods = await produtos.findAll({
    where: {
      categoria: Category
    }
  })
  let json = JSON.stringify(prods)
  return json

};

async function getMaisVendidos(){

  let prods = await produtos.findAll({
    where: {
      maisvendido: 1
    }
  })
  let json = JSON.stringify(prods)
  return json
  
};

async function newProduct(prods){
  try {
    prods.forEach(async prod => {
      console.log(prod)
      let created = await produtos.create(prod)
      //console.log(created)
    });
    
  }catch(error){
    console.log(error)
  }
}

  module.exports = { 
    newProduct: newProduct,
    getAllProducts: getAllProducts,
    getProductById:getProductById,
    getProductBolotas:getProductBolotas,
    getProductByCategory:getProductByCategory,
    getMaisVendidos:getMaisVendidos,
    searchProduct: searchProduct
  }
