const {model, Schema} = require('mongoose')

const fornecedoresSchema =  new Schema({
    fornecedor:{
      type: String
    },
    telefone:{
      type: String
    },
    email:{
      type: String
    },
    cep: {
      type: String
    },
    logradouro:{
      type: String
    },
    numero:{
      type: String
    },
    complemento:{
      type: String
    },
    bairro:{
      type: String
    },
    cidade:{
      type: String
    },
    uf:{
      type: String
    },
    //Novos dados
    cnpj: {
        type: String
      },
    site:{
      type: String
    },
    inscricao:{
      type: String
    }
  })

module.exports = model('Fornecedores', fornecedoresSchema)
