const { model, Schema } = require('mongoose')


//vamos criar um obejto -> modelo para coleção
//Importante:
const produtosSchema = new Schema({
  empresa: {
    type: String
  },
  codigo: {
    type: String
  },
  produto: {
    type: String
  },
  estoque: {
    type: String
  },
  valor: {
    type: String
  },
  lucro: {
    type: String
  },
  resultado: {
    type: String
  },
  preco: {
    type: String
  },
  site: {
    type: String
  },
  imagemProduto: {
    type: String
  }



})

//exportar o Schema -> main 
module.exports = model('Produtos', produtosSchema)