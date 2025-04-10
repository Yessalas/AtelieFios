// Foco inicial e desabilitar botões
const foco = document.getElementById('searchOrdem')
document.addEventListener('DOMContentLoaded', () => {
  btnUpdateO.disabled = true
  btnDeleteO.disabled = true
  foco.focus()
})

// Captura dos elementos do formulário
const frmOrdem = document.getElementById('frmOrdem')
const numOs = document.getElementById('inputNumeroOs')
const numSerie = document.getElementById('inputNumeroSerie')
const dtEntrada = document.getElementById('inputDataEntrada')
const nome = document.getElementById('inputNomeOrdem')
const telefone = document.getElementById('inputTelefoneOrdem')
const cpf = document.getElementById('inputCPFOrdem')
const status = document.getElementById('inputStatusOrdem')
const servico = document.getElementById('inputServicoOrdem')
const qtd = document.getElementById('inputQuantidadeOrdem')
const desc = document.getElementById('inputDescOrdem')
const marca = document.getElementById('inputMarcaOrdem')
const pgmt = document.getElementById('inputPagamentoOrdem')
const valor = document.getElementById('inputValorOrdem')

// Função para resetar o formulário
function reiniciarForm() {
  location.reload()
}

// Evento de envio
frmOrdem.addEventListener('submit', async (event) => {
  event.preventDefault()

  // Teste no console
  console.log(
    numOs.value,
    numSerie.value,
    dtEntrada.value,
    nome.value,
    telefone.value,
    cpf.value,
    status.value,
    servico.value,
    qtd.value,
    desc.value,
    marca.value,
    pgmt.value,
    valor.value
  )

  const ordem = {
    numOsOrdem: numOs.value,
    numSerieOrdem: numSerie.value,
    DtEntradaOrdem: dtEntrada.value || new Date().toISOString().slice(0, 10),
    DtSaidaOrdem: null,
    NomeOrdem: nome.value,
    TelefoneOrdem: telefone.value,
    CPF: cpf.value,
    StatusOrdem: status.value,
    ServicoOrdem: servico.value,
    QtdOrdem: qtd.value,
    DescOrdem: desc.value,
    MarcaOrdem: marca.value,
    PgmtOrdem: pgmt.value,
    ValorTlOrdem: valor.value
  }

  // Enviar para o processo principal
  api.newOrdem(ordem)
})

// Reset vindo do processo principal
// Reset vindo do processo principal
api.resetForm((args) => {
    reiniciarForm()
  })
  
  