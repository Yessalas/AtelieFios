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

  if (cod.dataset.id) {
    fios._id = cod.dataset.id
    api.updateFios(fios)
  } else {
    api.newFios(fios)
  }
})

btnDelete.addEventListener('click', () => {
  if (cod.dataset.id) {
    api.deleteFios(cod.dataset.id)
  }
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
    
    // Adiciona evento de clique para selecionar e preencher os campos
    linha.addEventListener('click', () => {
      // Remover destaque anterior
      document.querySelectorAll('#tabelaFios tr').forEach(row => row.classList.remove('table-primary'))
      linha.classList.add('table-primary')

      // Preencher os campos com os dados do fio selecionado
      cod.value = fio.CodigoFios
      marca.value = fio.MarcaFios
      cor.value = fio.CorFios
      qtd.value = fio.QtdFios

      // Guardar o _id escondido no dataset
      cod.dataset.id = fio._id

      // Habilitar botões
      btnUpdate.disabled = false
      btnDelete.disabled = false
    })

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


