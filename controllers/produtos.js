const db = require('../model/Db')
const products =  db.Sequelize.Op
const produtos = require('../model/products')



async function getAllProducts(){ 

  let teste = await produtos.findAll()
  let prods = [

    {
      id:1,cod_livro:124,quantidade:2,nome_autor:'Jane P. Laudon',nome_livro:'Sistemas de Informações Gerenciais',
      descricao:'Esta 11ª edição de Sistemas de informação gerenciais oferece, de maneira interativa e estimulante, uma cobertura completa e detalhada sobre novas tecnologias e aplicações de sistemas de informação, mostrando seus impactos nos modelos de negócio e nas tomadas de decisão gerenciais. Esta obra é indicada para alunos de cursos de graduação e MBA em administração, sistemas de informação, engenharia da computação e engenharia de produção, assim como para profissionais da área, que visam integrar negócios e tecnologia.',
      valor:152.90
  },
    {
      id:2,cod_livro:127,quantidade:5,nome_autor:'Willian Stallings',nome_livro:'Arquitetura e Organização de Computadores',
      descricao:'Arquitetura e organização de computadores, de William Stallings, além de apresentar as principais mudanças, inovações e melhorias na área de computação por meio de uma abordagem ampla e abrangente da área de arquitetura de computadores, também promove uma profunda reflexão sobre os fundamentos da área, estabelecendo relações com questões contemporâneas de design computacional. Nesta edição, o autor aborda a ampla adoção do funcionamento da GPGPUs em conjunto com as CPUs tradicionais para lidar com as inúmeras aplicações que envolvem grandes conjuntos de dados, processadores multicore, cloud computing, a utilização da tecnologia e organização de memória flash para memória interna e externa, e a tecnologia Direct cache access, desenvolvida pela Intel e por outros fabricantes para proporcionar rendimento melhor que a tradicional abordagem de acesso de memória direta (direct memory access). Complementado por inúmeros exercícios de aprendizagem, este livro é indicado para estudantes de ciência da computação, engenharia da computação e sistemas de informação. Todavia, por sua abrangência e didática, também é leitura indispensável para profissionais da área que desejem aprofundar e atualizar seus conhecimentos.',
      valor:166.00
    },
    {
      id:3,cod_livro:120,quantidade:8,nome_autor:'Felipe Machado',nome_livro:'Tecnologia e projeto de Data Warehouse',
      descricao:'Com apresentação técnica diferenciada e metodologia embasada na experiência em processos de Data Warehousing, o professor e consultor Felipe Machado transmite seus conhecimentos de forma gradativa e efetiva. Com destaque a aspectos conceituais e orientação à gestão de negócios, as arquiteturas e tecnologias envolvidas no processo de Data Warehousing são explanadas por meio de exemplos e estudos de caso, considerando-se a versão 2008 do SQL Analisys Server e os conceitos estratégicos de BI Competence Center. Na sexta edição, são apresentadas definições e tecnologias de Big Data e sua correlação com Data Warehouse, para que o leitor sempre acompanhe um padrão de conteúdo atualizado de tecnologias.',
      valor:137.70
    }
  ]
  let json = JSON.stringify(prods)
  console.log(teste);
  return json

}

getAllProducts();

/* async function searchProduct(search){
  
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
}*/

async function getProductById(Id){
  let prods = await produtos.findAll({
    where: {
      id: Id
    }
  })
  let json = prods
  console.log('productByid:',json)
  return json
};
getProductById(1)
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
    return error
  }
}

async function updateProduct(id,prod){

  let result = await produtos.update({

    nome: prod.nome,
    categoria:prod.categ,
    preco: 44.99,
    imagePath:prod.url,
    maisvendido:prod.maisvendido,
    imageBrancaPath:prod.urlBranca,
    placaDecoPath:prod.urlPlacaDeco,
    area:prod.area
    
  },{
    where:{id:id}
  })
  console.log(result)
  return result

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
   // searchProduct: searchProduct,
    delProduct:delProduct
  }
