/**
 * funções de renderização
 */

function cliente(){
    api.clientWindow()
}


function ordems(){
    api.ordemsWindow()
}

function lans(){
    api.fiosWindow()
}

// Troca do ícone do banco de dados (Usando a api do preload.js)
api.dbStatus((event, message)=>{
    // Teste do recebimento da mensagem do main
    console.log(message)
    if(message==="conectado"){
        document.getElementById('statusdb').src="../public/img/banco-de-dados-conectado.png"
    } else{
        document.getElementById('statusdb').src="../public/img/banco-de-dados-erro.png"        
    }
})