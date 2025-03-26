/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// importação do mongoose
const mongoose = require('mongoose')

// configuração do acesso ao banco de dados
// ip/link - autenticação
// Obs: Atlas(obter via compass)
// Para criar um banco de dados personalizado basta escolher um nome no final da String da url (ex: dbclientes)
const url = 'mongodb+srv://admin:123senac@aws-db.rvfet.mongodb.net/dbAtelie'

// criar uma variável de apoio para validação
let conectado = false

// método para conectar o banco de dados
// async executar a função de forma assíncrona
const conectar = async () => {
    // validação (se não estiver conectado, conectar)
    if (!conectado) {
        // conectar com o banco de dados
        // try catch - tratamento de exceções
        try {
            await mongoose.connect(url) //conectar
            conectado = true //setar a variável
            console.log("MongoDB conectado")
        } catch (error) {
            // se o código de erro = 8000 (autenticação)
            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
        }
    }
}

// método para desconectar o banco de dados
const desconectar = async () => {
    // validação (se estiver conectado, desconectar)
    if (conectado) {
        // desconectar do banco de dados        
        try {
            await mongoose.disconnect(url) //desconectar
            conectado = false //setar a variável
            console.log("MongoDB desconectado")
        } catch (error) {
            console.log(error)
        }
    }
}

// exportar para o main os métodos conectar e desconectar
module.exports = { conectar, desconectar }