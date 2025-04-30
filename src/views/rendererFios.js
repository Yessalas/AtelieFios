// Acessar campos e botões
const foco = document.getElementById('searchFios')
const cod = document.getElementById('inputCodFios')
const marca = document.getElementById('inputMarcaFios')
const cor = document.getElementById('inputCorFios')
const qtd = document.getElementById('inputQtdFios')
const btnUpdate = document.getElementById('btnUpdate')
const btnDelete = document.getElementById('btnDelete')

let listaFios = []

// Pede ao main os fios do banco ao abrir
document.addEventListener('DOMContentLoaded', () => {
  api.listarFios()
  foco.focus()
  btnUpdate.disabled = true
  btnDelete.disabled = true
})

// Recebe e renderiza a lista vinda do banco
api.renderFios((data) => {
  listaFios = JSON.parse(data)
  renderizarTabela(listaFios)
})

// Envia novo fio
frmFios.addEventListener('submit', (e) => {
  e.preventDefault()

  const fios = {
    CodigoFios: cod.value,
    MarcaFios: marca.value,
    CorFios: cor.value,
    QtdFios: parseInt(qtd.value)
  }

  api.newFios(fios)
})

function resetFormFios() {
  location.reload()
}

api.resetFormFios(() => {
  resetFormFios()
})

// Monta tabela com os fios
function renderizarTabela(lista) {
  const tabela = document.getElementById('tabelaFios')
  tabela.innerHTML = ''

  lista.forEach((fio) => {
    const linha = document.createElement('tr')
    linha.innerHTML = `
      <td>${fio.QtdFios}</td>
      <td>${fio.MarcaFios}</td>
      <td>${fio.CorFios}</td>
      <td>${fio.CodigoFios}</td>
    `
    tabela.appendChild(linha)
  })
}

// Filtra a tabela com base no campo de busca
function searchClient() {
  const termo = foco.value.toLowerCase()

  const filtrados = listaFios.filter((fio) => {
    return (
      fio.CodigoFios.toLowerCase().includes(termo) ||
      fio.MarcaFios.toLowerCase().includes(termo) ||
      (fio.CorFios && fio.CorFios.toLowerCase().includes(termo))
    )
  })

  renderizarTabela(filtrados)
}
