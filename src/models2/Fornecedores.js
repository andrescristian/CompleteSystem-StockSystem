const {model, Schema} = require('mongoose')

//Criar um Schema de Fornecedores
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

//Exportar o Schema de Fornecedores
module.exports = model('Fornecedores', fornecedoresSchema)