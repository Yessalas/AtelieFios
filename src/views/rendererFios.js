// Foco inicial e desativa botões
const foco = document.getElementById('searchFios')
document.addEventListener('DOMContentLoaded', () => {
  btnUpdate.disabled = true
  btnDelete.disabled = true
  foco.focus()
})

// Captura dos inputs
const frmFios = document.getElementById('frmFios')
const cod = document.getElementById('inputCodFios')
const marca = document.getElementById('inputMarcaFios')
const cor = document.getElementById('inputCorFios')
const qtd = document.getElementById('inputQtdFios')

// Envio do formulário
frmFios.addEventListener('submit', (e) => {
  e.preventDefault()

  const fios = {
    CodigoFios: cod.value,
    MarcaFios: marca.value,
    CorFios: cor.value,
    QtdFios: parseInt(qtd.value)
  }

  // Enviar para o processo principal
  api.newFios(fios)
})

function resetFormFios() {
    cod.value = ''
    marca.value = ''
    cor.value = ''
    qtd.value = ''
    cod.focus()
  }
  
  // Ouve o sinal do main para resetar o form
  api.resetFormFios(() => {
    resetFormFios()
  })