const { model, Schema } = require('mongoose')

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

module.exports = model('Produtos', produtosSchema)
