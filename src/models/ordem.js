const { model, Schema } = require('mongoose')

// criação da estrutura da coleção Clientes
const clienteSchema = new Schema({
    
},{versionKey: false}) //não versionar os dados armazenados

// exportar para o main o modelo de dados
// OBS: Clientes será o nome da coleção
module.exports = model('Atelie - OS - ordem', clienteSchema)