function formatarValor(input) {
  let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  if (valor.length > 2) {
      valor = valor.slice(0, -2) + ',' + valor.slice(-2); // Insere a vírgula antes dos dois últimos dígitos
  }
  input.value = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adiciona pontos como separadores de milhar
}



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
const statusS = document.getElementById('inputStatusOrdem')
const servico = document.getElementById('inputServicoOrdem')
const qtd = document.getElementById('inputQuantidadeOrdem')
const desc = document.getElementById('inputDescOrdem')
const marca = document.getElementById('inputMarcaOrdem')
const cor = document.getElementById('inputCorOrdem')
const pgmt = document.getElementById('inputPagamentoOrdem')
const valor = document.getElementById('inputValorOrdem')

// capturar os id referente ao campo do nome
const input = document.getElementById('inputSearchClient')
// capturar o id do ul da lista de sugestões de clientes
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser preenchidos
let idClient = document.getElementById('inputIdClient')

let dateOS = document.getElementById('inputData')

let idOS = document.getElementById('inputOS')

// Função para resetar o formulário

// Evento de envio do formulário
frmOrdem.addEventListener('submit', async (event) => {
  event.preventDefault()

  const ordem = {
    numOsOrdem: numOs.value,
    idClientOrdem:idClient.value,
    NomeOrdem: nome.value,
    TelefoneOrdem: telefone.value, 
    StatusOrdem: statusS.value,
    ServicoOrdem: servico.value,
    QtdOrdem: qtd.value,
    DescOrdem: desc.value,
    MarcaOrdem: marca.value,
    CorOrdem: cor.value,
    PgmtOrdem: pgmt.value,
    ValorTlOrdem: valor.value
  }

  // Enviar para o processo principal
  api.newOrdem(ordem)
})

// ==================================================
// == Busca avançada - estilo Google ================


// vetor usado na manipulação (filtragem) dos dados
let arrayClients = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minúsculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    //console.log(search) // teste de apoio a lógica
    // Passo 2: Enviar ao main um pedido de busca de clientes pelo nome (via preload - api )
    api.searchClients()

    // Recebimento dos clientes do banco de dados (passo 3)
    api.listClients((event, clients) => {
        // console.log(clients) // teste do passo 3
        // converter para JSON os dados dos clientes recebidos
        const dataClients = JSON.parse(clients)
        // armazenar no vetor os dados dos clientes
        arrayClients = dataClients
        // Passo 4: Filtrar os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real
        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10) //máximo 10 resultados
        //console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um ítem da lista <li>
        results.forEach(c => {
            // criar o elemento li
            const item = document.createElement('li')
            // adicionar classes bootstrap a cada li criado
            item.classList.add('list-group-item', 'list-group-item-action')
            // exibir o nome do cliente
            item.textContent = c.nomeCliente

            // adicionar os li s criados a lista ul
            suggestionList.appendChild(item)

            // adicionar um evento de clique no item da lista para preencher os campos do formulário
            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                // limpar o input e recolher a lista
                input.value = ""
                suggestionList.innerHTML = ""
            })
        })
    })
})

// Ocultar a lista ao clicar fora
document.addEventListener('click', (event) => {
    // ocultar a lista se ela existir e estiver ativa
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})

// == Fim - busca avançada ==========================
// ==================================================


// ============================================================
// == Buscar OS - CRUD Read ===================================

function findOS() {
  api.searchOS()
}

api.renderOS((event, dataOS) => {
  console.log(dataOS)
  const os = JSON.parse(dataOS)
  // preencher os campos com os dados da OS
  idOS.value = os._id
  // formatar data:
  const data = new Date(os.dataEntrada)
  const formatada = data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
  })
  dateOS.value = formatada  
  idClient.value = os.IdCliente,
  nome.value = os.NomeCliente, 
  telefone.value = os.Telefone, 
  statusS.value =os.StatusOs, 
  servico.value = os.Servico,  
  qtd.value = os.Qtd, 
  desc.value = os.Desc,
  marca.value = os.Marca,
  cor.value = os.Cor,
  pgmt.value = os.Pgmt,
  valor.value = os.ValorTotal,
})

// == Fim - Buscar OS - CRUD Read =============================
// ============================================================


// Receber resposta e resetar formulário
function resetFormOs() {
  location.reload()
}


api.resetFormOs(() => {
  resetFormOs()
})
