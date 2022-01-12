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
      var created = await produtos.create({
        nome: prod.nome,
        categoria:prod.categ,
        preco: 44.99,
        imagePath:prod.url,
        maisvendido:prod.maisvendido,
        imageBrancaPath:prod.imageBrancaPath,
        placaDecoPath:prod.placaDecoPath,
        area:prod.area
      })
      console.log('created'+created)
      return created

    });
    
  }catch(error){
    console.log(error)
  }
}

async function delProduct(id){

  let result = await produtos.destroy({
    where:{id:id}
  })
  console.log(result)
  return result

}

  module.exports = { 
    newProduct: newProduct,
    getAllProducts: getAllProducts,
    getProductById:getProductById,
    getProductBolotas:getProductBolotas,
    getProductByCategory:getProductByCategory,
    getMaisVendidos:getMaisVendidos,
    searchProduct: searchProduct,
    delProduct:delProduct
  }
