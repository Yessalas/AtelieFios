// Foco inicial e desabilitar botões (opcional)
document.addEventListener('DOMContentLoaded', () => {
  const btnUpdateO = document.getElementById('btnUpdateO')
  const btnDeleteO = document.getElementById('btnDeleteO')

  if (btnUpdateO && btnDeleteO) {
    btnUpdateO.disabled = true
    btnDeleteO.disabled = true
  }
})

// Captura dos elementos do formulário
const frmOrdem = document.getElementById('frmOrdem')
const numOs = document.getElementById('txtOs')
const dtEntrada = document.getElementById('txtData')
const nome = document.getElementById('inputNameClient')
const telefone = document.getElementById('inputPhoneClient')
const status = document.getElementById('inputStatusOrdem')
const servico = document.getElementById('inputServicoOrdem')
const qtd = document.getElementById('inputQuantidadeOrdem')
const desc = document.getElementById('inputDescOrdem')
const marca = document.getElementById('inputMarcaOrdem')
const pgmt = document.getElementById('inputPagamentoOrdem')
const valor = document.getElementById('inputValorOrdem')

// Função para resetar o formulário
function resetFormOs() {
  location.reload()
}

// Evento de envio do formulário
frmOrdem.addEventListener('submit', async (event) => {
  event.preventDefault()

  const ordem = {
    numOsOrdem: numOs.value,
    DtEntradaOrdem: dtEntrada.value || new Date().toISOString().slice(0, 10),
    DtSaidaOrdem: null,
    NomeOrdem: nome.value,
    TelefoneOrdem: telefone.value,
    CPF: "", // CPF não existe no HTML atual, ajuste se adicionar
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

// Receber resposta e resetar formulário
api.resetFormOs(() => {
  resetFormOs()
})
