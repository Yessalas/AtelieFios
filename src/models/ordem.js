const { model, Schema } = require('mongoose')

// criação da estrutura da coleção Clientes
const ordemSchema = new Schema({
    numOsOrdem: {
        type: String
    },
    numSerieOrdem:{
        type: String
    } , 
    DtEntradaOrdem:{

    } , 
    DtSaidaOrdem:{
        type: String
    } , 
    NomeOrdem:{
        type: String
    }, 
    TelefoneOrdem:{
        type: String
    },
    CPFOrdem:{
        type: String,
        unique:true,
        index: true
    },
    StatusOrdem:{
        type: String
    },  
    ServicoOrdem:{
        type: String
    }, 
    QtdOrdem:{
        type: String
    },  
    MarcaOrdem:{
        type: String
    }, 
    PgmtOrdem:{
        type: String
    },
    ValorTlOrdem:{
        type: String
    }
    
},{versionKey: false}) //não versionar os dados armazenados

// exportar para o main o modelo de dados
// OBS: Clientes será o nome da coleção
module.exports = model('Atelie - OS - ordem', ordemSchema)