const { model, Schema } = require('mongoose')
// const { type } = require('os')

// criação da estrutura da coleção Clientes
const ordemSchema = new Schema({
    numOs: {
        type: String
    },
    numSerie:{
        type: String
    } , 
    DtEntrada:{
        type: Date,
        default: Date.now
    } , 
    
    NomeCliente:{
        type: String
    }, 
    Telefone:{
        type: String
    },
    CPF:{
        type: String
    },
    StatusOs:{
        type: String
    },  
    Servico:{
        type: String
    }, 
    Qtd:{
        type: String
    },  
    Desc:{
        type: String
    },
    Marca:{
        type: String
    }, 
    Pgmt:{
        type: String
    },
    ValorTotal:{
        type: String
    }
    
},{versionKey: false}) //não versionar os dados armazenados

// exportar para o main o modelo de dados
// OBS: Clientes será o nome da coleção
module.exports = model('Atelie - OS - ordem', ordemSchema)