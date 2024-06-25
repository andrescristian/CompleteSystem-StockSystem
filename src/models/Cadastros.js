const {model, Schema } =  require ('mongoose')


//vamos criar um obejto -> modelo para coleção
//Parte importante:
const cadastrosSchema =  new Schema({
    nome:{
      type: String
    },
    telefone:{
      type: String
    },
    email:{
      type: String
    },
    cpf: {
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
    }
  })

  //exportar o Schema -> main 
module.exports = model('Cadastros', cadastrosSchema)

