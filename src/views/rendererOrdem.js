const foco = document.getElementById('searchOrdem')
// iniciar a janel de cliente alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded',() => {
    // desativar os botões
    btnUpdateO.disabled= true
    btnDeleteO.disabled= true
    foco.focus()
})

// Captura dos dados dos input do funcionario (Passo 1: fluxo)
let frmOrdem=document.getElementById('frmOrdem')
let numOsOrdem=document.getElementById('inputNumeroOs')
let numSerieOrdem=document.getElementById('inputNumeroSerie')
let DtEntradaOrdem=document.getElementById('inputDataEntrada')
let DtSaidaOrdem=document.getElementById('inputDataSaida')
let NomeOrdem=document.getElementById('inputNomeOrdem')
let TelefoneOrdem=document.getElementById('inputTelefoneOrdem')
let CPFOrdem=document.getElementById('inputCPFOrdem')
let StatusOrdem=document.getElementById('inputStatusOrdem')
let ServicoOrdem=document.getElementById('inputServicoOrdem')
let QtdOrdem=document.getElementById('inputQuantidadeOrdem')
let MarcaOrdem=document.getElementById('inputMarcaOrdem')
let PgmtOrdem=document.getElementById('inputPagamentoOrdem')
let ValorTlOrdem=document.getElementById('inputValorOrdem')

// 
// Evento associado ao botão submit (Uso das validações do HTML)
frmOrdem.addEventListener('submitO', async (event)=>{
    // Evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento HTML
    event.preventDefault()

    // Teste importante (Recebimento dos dados do formulário - Passo 1 do fluxo)
    console.log(
        numOsOrdem.value, 
        numSerieOrdem.value, 
        DtEntradaOrdem.value, 
        DtSaidaOrdem.value, 
        NomeOrdem.value, 
        TelefoneOrdem.value, 
        CPFOrdem.value,
        StatusOrdem.value, 
        ServicoOrdem.value, 
        QtdOrdem.value, 
        MarcaOrdem.value,
        PgmtOrdem.value,
        ValorTlOrdem.value
    )
    // criar um objeto para armazenar os dados do cliente antes de enviar ao main
    const ordems = {
        numOsOrdem: numOsOrdem.value, 
        numSerieOrdem: numSerieOrdem.value, 
        DtEntradaOrdem: DtEntradaOrdem.value, 
        DtSaidaOrdem: DtSaidaOrdem.value, 
        NomeOrdem: NomeOrdem.value, 
        TelefoneOrdem: TelefoneOrdem.value, 
        CPFOrdem: CPFOrdem.value,
        StatusOrdem: StatusOrdem.value, 
        ServicoOrdem: ServicoOrdem.value, 
        QtdOrdem: QtdOrdem.value, 
        MarcaOrdem: MarcaOrdem.value,
        PgmtOrdem: PgmtOrdem.value,
        ValorTlOrdem: ValorTlOrdem.value
    }
    // enviar ao main o objeto client - passo 2 fluxo
    api.newOrdem(ordems)
})