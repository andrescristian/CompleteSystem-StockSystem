const mongoose = require('mongoose');
const cadastros = require('./src/models/Cadastros');

let url = ""
const conectar = async () => {
try {
    await mongoose.connect(url);
    console.log("MongoDB Conectado.")
  } 
  catch (error) {
    handleError(error);
    console.log("Problema detectado:", error.message)
    throw error
  }
}

const desconectar = async () => {
  try {
    await mongoose.disconnect(url);
    console.log("MongoDB Desconectado.")
  } 
  catch (error) {
    handleError(error);
    console.log("Problema detectado:", error.message)
    throw error
  }
}

module.exports = {conectar, desconectar}
