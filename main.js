//console.log('Hello from Electron.')
const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

const path= require('node:path')
// nativeTheme.themeSource = 'light'

// Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// importação do schema clientes da camada model
const clientModel = require ('./src/models/cliente.js')
const ordemModel = require ('./src/models/ordem.js')
const fiosModel = require ('./src/models/fios.js')


// importaçpão do pacote jspdf (npm i jspdf)
const {jspdf, default: jsPDF}= require('jspdf')
// importação da biblioteca fs (nativa do javascript)par manipulação de arquivos (no caso arquivos pdf)
const fs = require ('fs')

const prompt = require('electron-prompt')

const mongoose = require('mongoose')

// -------------- Janela Principal ----------------------------------------
const createWindow = () => {
  nativeTheme.themeSource = 'light'
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/trico.png',
    resizable: false,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js')
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')

  
}
// ----------------- Fim janela principar-------------------------------------

// ------------------- Janela Sobre -----------------------------------
function aboutWindows(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela sobre
  const main = BrowserWindow.getFocusedWindow()
  let about
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela sobre
    about = new BrowserWindow({
        width: 400,
        height: 400,
        icon: './src/public/img/trico.png',
        autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true
    })
  }
  about.loadFile('./src/views/sobre.html')
}

// ------------------- Fim Janela Sobre-----------------------------------
// ------------------------ Janela Cliente --------------------------------------------------
function clientWindow(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let client
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela cliente
    client = new BrowserWindow({
      width: 850,
      height: 660,
      //autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })
  }
  client.loadFile('./src/views/cliente.html')
  client.center()
}
// -------------------------- Fim Janela Cliente ------------------------------------------------

// ------------------------ Janela OS (ordem de serviço) --------------------------------------------------
let ordem
function ordemsWindow(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let ordem
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela OS
    ordem = new BrowserWindow({
      width: 950,
      height: 760,
        icon: './src/public/img/trico.png',
        // autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  ordem.loadFile('./src/views/ordem.html')
  ordem.center()
}
// -------------------------- Fim Janela OS (ordem de serviço) ------------------------------------------------

// ------------------------ Janela Fios --------------------------------------------------
function fiosWindow(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let fios
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela fios
    fios = new BrowserWindow({
        width: 950,
        height: 750,
        icon: './src/public/img/trico.png',
        //autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  fios.loadFile('./src/views/fios.html')
  fios.center()
}
// -------------------------- Fim Janela Fios (ordem de serviço) ------------------------------------------------
// Iniciar a aplicação
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
      }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit()
  }
})

// reduzir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
  let conectado = await conectar()
  // se conectado for igual a true
  if (conectado) {
      // enviar uma mensagem para o renderizador trocar o ícone, criar um delay de 0.5s para sincronizar a nuvem
      setTimeout(()=> {
          event.reply('db-status',"conectado")
      }, 500) //500ms        
  }
})

// IMPORTANTE ! Desconectar do banco de dados quando a aplicação for encerrada.
app.on('before-quit', () => {
  desconectar()
})

// ----------------------------- Menu --------------------------------------------------
const template = [
  {
      label: 'Cadastro',
      submenu:[
        {
          label: 'Clientes',
          click: () => clientWindow()
        },
        {
          label: 'OS',
          click: () => ordemsWindow()
        },
        {
          type: 'separator'
        },
        {
          label:'Sair',
          click:() => app.quit(),
          accelerator: 'Alt+F4'
        }
      ]
  },
  {
      label: 'Relatórios',
      submenu: [
        {
          label:'Clientes',
          click: () => relatorioClientes()
        },
        {
          label:'Fio&Lans',
          click: () => fiosWindow()
        },
        {
          label:'OS abertas',
          click: () => relatorioOSaberta()
        },
        {
          label:'Os em andamento',
          click: () => relatorioOSandamento()
        },
        
        {
          label:'Os concluidas',
          click: () => relatorioOSconcluida()
        }
        
      ]
  },    
  {
      label: 'Ferramentas',
      submenu:[
        {
          label: 'Aplicar zoom',
          role: 'zoomIn'
        },
        {
          label:'Reduzir',
          role:'zoomOut'
        },
        {
          label:'Restaurar o zoom padrão',
          role:'resetZoom'
        },
        {
          type: 'separator',

        },
        {
          label: 'Recarregador',
          role: 'reload'
        },
        {
          label:'Ferramentas do desenvolvedor',
          role:'toggleDevTools'
        }
      ]
  },
  {
      label: 'Ajuda',
      submenu:[
        {
          label:'Sobre',
          click: () => aboutWindows()
        }
      ]
  }
]

// / recebimento dos pedidos de abertura de janelas(renderizador)
  ipcMain.on('client-window', () => {
    clientWindow()
  })

  ipcMain.on('ordems-window', () => {
    ordemsWindow()
  })
  ipcMain.on('fios-window', () => {
    fiosWindow()
  })

  ipcMain.on('new-client', async (event, client) => {
    // importante! teste de recebimento dos dados do cliente
    console.log(client)
    //cadastrar a estrutura de dados no banco de dados mongodb
    try {
        //criar uma nova de estrutura de dados usando a classe
        // modelo. atenção os atributos precisam ser idê
        const newClient = new clientModel({
            nomeCliente: client.nameClient,
            cpfCliente:client.cpfClient,
            emailCliente:client.emailClient,
            foneCliente:client.phoneClient,
            cepCliente:client.cepClient,
            logradouroCliente:client.addressClient,
            numeroCliente:client.numberClient,
            complementoCliente:client.complementClient,
            bairroCliente:client.neighborhoodClient,
            cidadeCliente:client.cityClient,
            ufcCliente:client.ufClient
        })
        await newClient.save()
        dialog.showMessageBox({
          //customização
          type: 'info',
          title: "Aviso",
          message: "Cliente adicionado com sucesso",
          buttons: ['OK']
      }).then((result) => {
          //ação ao pressionar o botão (result = 0)
          if (result.response === 0) {
              //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
              event.reply('reset-form')
          }
      })
  } catch (error) {
      // se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuário
      if (error.code === 11000) {
          dialog.showMessageBox({
              type: 'error',
              title: "Atenção!",
              message: "CPF já está cadastrado\nVerifique se digitou corretamente",
              buttons: ['OK']
          }).then((result) => {
              if (result.response === 0) {
                  // limpar a caixa de input do cpf, focar esta caixa e deixar a borda em vermelho
              }
          })
      }
      console.log(error)
  }
})

ipcMain.on('new-ordem', async (event, ordem) => {
  console.log( ordem)

  try {
    const newOrdem = new ordemModel({
      // numOs: ordem.numOsOrdem,    
      IdCliente:ordem.idClientOrdem,
      NomeCliente: ordem.NomeOrdem, 
      Telefone: ordem.TelefoneOrdem, 
      StatusOs: ordem.StatusOrdem, 
      Servico: ordem.ServicoOrdem,  
      Qtd: ordem.QtdOrdem, 
      Desc: ordem.DescOrdem,
      Marca: ordem.MarcaOrdem,
      Cor: ordem.CorOrdem,
      Pgmt: ordem.PgmtOrdem,
      ValorTotal: ordem.ValorTlOrdem
    })

    await newOrdem.save()

    dialog.showMessageBox({
      type: 'info',
      title: 'Sucesso',
      message: 'Ordem de Serviço cadastrada com sucesso!',
      buttons: ['OK']
    }).then(() => {
      event.reply('reset-form-os') // Você pode usar isso para limpar o form via preload.js
    })

  } catch (error) {
    console.error('Erro ao salvar a OS:', error)
    dialog.showErrorBox('Erro ao salvar OS', error.message || 'Verifique os dados e tente novamente.')
  }
})


ipcMain.on('new-fios', async (event, fios) => {
  try {
    const newFios = new fiosModel({
      CodigoFios: fios.CodigoFios,
      MarcaFios: fios.MarcaFios,
      CorFios: fios.CorFios,
      QtdFios: fios.QtdFios
    })
    await newFios.save()

    dialog.showMessageBox({
      type: 'info',
      title: 'Sucesso',
      message: 'Fio cadastrado com sucesso!',
      buttons: ['OK']
    }).then(() => {
      event.reply('reset-form-fios')
    })
  } catch (error) {
    if (error.code === 11000) {
      dialog.showErrorBox('Erro', `Código de fio já cadastrado!`)
    } else {
      dialog.showErrorBox('Erro ao salvar fio', error.message)
    }
  }
})

  

// RELATORIO DE CLIENTES
async function relatorioClientes() {
  try {
      // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
      const clientes = await clientModel.find().sort({ nomeCliente: 1 })
      // teste de recebimento da listagem de clientes
      //console.log(clientes)
      // Passo 2:Formatação do documento pdf
      // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
      const doc = new jsPDF('p', 'mm', 'a4')
      // Inserir imagem no documento pdf
      // imagePath (caminho da imagem que será inserida no pdf)
      // imageBase64 (uso da biblioteca fs par ler o arquivo no formato png)
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
      // definir o tamanho da fonte (tamanho equivalente ao word)
      doc.setFontSize(18)
      // escrever um texto (título)
      doc.text("Relatório de clientes", 14, 45)//x, y (mm)
      // inserir a data atual no relatório
      const dataAtual = new Date().toLocaleDateString('pt-BR')
      doc.setFontSize(12)
      doc.text(`Data: ${dataAtual}`, 165, 10)
      // variável de apoio na formatação
      let y = 60
      doc.text("Nome", 14, y)
      doc.text("Telefone", 80, y)
      doc.text("E-mail", 130, y)
      y += 5
      // desenhar uma linha
      doc.setLineWidth(0.5) // expessura da linha
      doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)

      // renderizar os clientes cadastrados no banco
      y += 10 // espaçamento da linha
      // percorrer o vetor clientes(obtido do banco) usando o laço forEach (equivale ao laço for)
      clientes.forEach((c) => {
          // adicionar outra página se a folha inteira for preenchida (estratégia é saber o tamnaho da folha)
          // folha A4 y = 297mm
          if (y > 280) {
              doc.addPage()
              y = 20 // resetar a variável y
              // redesenhar o cabeçalho
              doc.text("Nome", 14, y)
              doc.text("Telefone", 80, y)
              doc.text("E-mail", 130, y)
              y += 5
              doc.setLineWidth(0.5)
              doc.line(10, y, 200, y)
              y += 10
          }
          doc.text(c.nomeCliente, 14, y),
              doc.text(c.foneCliente, 80, y),
              doc.text(c.emailCliente || "N/A", 130, y)
          y += 10 //quebra de linha
      })

      // Adicionar numeração automática de páginas
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
      }

      // Definir o caminho do arquivo temporário e nome do arquivo
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'clientes.pdf')
      // salvar temporariamente o arquivo
      doc.save(filePath)
      // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
      shell.openPath(filePath)
  } catch (error) {
      console.log(error)
  }
}

// RELATORIO DE OS
async function relatorioOSaberta() {
  try {
      // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
      const clientes = await ordemModel.find({ StatusOs: 'Aberta' }).sort({ NomeCliente: 1 })
      // teste de recebimento da listagem de clientes
      //console.log(clientes)
      // Passo 2:Formatação do documento pdf
      // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
      const doc = new jsPDF('p', 'mm', 'a4')
      // Inserir imagem no documento pdf
      // imagePath (caminho da imagem que será inserida no pdf)
      // imageBase64 (uso da biblioteca fs par ler o arquivo no formato png)
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
      // definir o tamanho da fonte (tamanho equivalente ao word)
      doc.setFontSize(18)
      // escrever um texto (título)
      doc.text("Relatório de Ordem de serviço", 14, 45)//x, y (mm)
      // inserir a data atual no relatório
      const dataAtual = new Date().toLocaleDateString('pt-BR')
      doc.setFontSize(12)
      doc.text(`Data: ${dataAtual}`, 165, 10)
      // variável de apoio na formatação
      let y = 60
      doc.text("Nome", 14, y)
      doc.text("StatusOS", 80, y)
      doc.text("Telefone", 130, y)
      y += 5
      // desenhar uma linha
      doc.setLineWidth(0.5) // expessura da linha
      doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)

      // renderizar os clientes cadastrados no banco
      y += 10 // espaçamento da linha
      // percorrer o vetor clientes(obtido do banco) usando o laço forEach (equivale ao laço for)
      clientes.forEach((c) => {
          // adicionar outra página se a folha inteira for preenchida (estratégia é saber o tamnaho da folha)
          // folha A4 y = 297mm
          if (y > 280) {
              doc.addPage()
              y = 20 // resetar a variável y
              // redesenhar o cabeçalho
              doc.text("Nome", 14, y)
              doc.text("StatusOS", 80, y)
              doc.text("Telefone", 130, y)
              y += 5
              doc.setLineWidth(0.5)
              doc.line(10, y, 200, y)
              y += 10
          }
          doc.text(c.NomeCliente, 14, y),
              doc.text(c.StatusOs, 80, y),
              doc.text(c.Telefone || "N/A", 130, y)
          y += 10 //quebra de linha
      })

      // Adicionar numeração automática de páginas
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
      }

      // Definir o caminho do arquivo temporário e nome do arquivo
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'os-aberta.pdf')
      // salvar temporariamente o arquivo
      doc.save(filePath)
      // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
      shell.openPath(filePath)
  } catch (error) {
      console.log(error)
  }
}


async function relatorioOSandamento() {
  try {
      // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
      const clientes = await ordemModel.find({ StatusOs: 'Em andamento' }).sort({ NomeCliente: 1 })
      // teste de recebimento da listagem de clientes
      //console.log(clientes)
      // Passo 2:Formatação do documento pdf
      // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
      const doc = new jsPDF('p', 'mm', 'a4')
      // Inserir imagem no documento pdf
      // imagePath (caminho da imagem que será inserida no pdf)
      // imageBase64 (uso da biblioteca fs par ler o arquivo no formato png)
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
      // definir o tamanho da fonte (tamanho equivalente ao word)
      doc.setFontSize(18)
      // escrever um texto (título)
      doc.text("Relatório de Ordem de serviço", 14, 45)//x, y (mm)
      // inserir a data atual no relatório
      const dataAtual = new Date().toLocaleDateString('pt-BR')
      doc.setFontSize(12)
      doc.text(`Data: ${dataAtual}`, 165, 10)
      // variável de apoio na formatação
      let y = 60
      doc.text("Nome", 14, y)
      doc.text("StatusOS", 80, y)
      doc.text("Telefone", 130, y)
      y += 5
      // desenhar uma linha
      doc.setLineWidth(0.5) // expessura da linha
      doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)

      // renderizar os clientes cadastrados no banco
      y += 10 // espaçamento da linha
      // percorrer o vetor clientes(obtido do banco) usando o laço forEach (equivale ao laço for)
      clientes.forEach((c) => {
          // adicionar outra página se a folha inteira for preenchida (estratégia é saber o tamnaho da folha)
          // folha A4 y = 297mm
          if (y > 280) {
              doc.addPage()
              y = 20 // resetar a variável y
              // redesenhar o cabeçalho
              doc.text("Nome", 14, y)
              doc.text("StatusOS", 80, y)
              doc.text("Telefone", 130, y)
              y += 5
              doc.setLineWidth(0.5)
              doc.line(10, y, 200, y)
              y += 10
          }
          doc.text(c.NomeCliente, 14, y),
              doc.text(c.StatusOs, 80, y),
              doc.text(c.Telefone || "N/A", 130, y)
          y += 10 //quebra de linha
      })

      // Adicionar numeração automática de páginas
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
      }

      // Definir o caminho do arquivo temporário e nome do arquivo
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'os-aberta.pdf')
      // salvar temporariamente o arquivo
      doc.save(filePath)
      // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
      shell.openPath(filePath)
  } catch (error) {
      console.log(error)
  }
}


async function relatorioOSconcluida() {
  try {
      // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
      const clientes = await ordemModel.find({ StatusOs: 'Concluída' }).sort({ NomeCliente: 1 })
      // teste de recebimento da listagem de clientes
      //console.log(clientes)
      // Passo 2:Formatação do documento pdf
      // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
      const doc = new jsPDF('p', 'mm', 'a4')
      // Inserir imagem no documento pdf
      // imagePath (caminho da imagem que será inserida no pdf)
      // imageBase64 (uso da biblioteca fs par ler o arquivo no formato png)
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
      // definir o tamanho da fonte (tamanho equivalente ao word)
      doc.setFontSize(18)
      // escrever um texto (título)
      doc.text("Relatório de Ordem de serviço", 14, 45)//x, y (mm)
      // inserir a data atual no relatório
      const dataAtual = new Date().toLocaleDateString('pt-BR')
      doc.setFontSize(12)
      doc.text(`Data: ${dataAtual}`, 165, 10)
      // variável de apoio na formatação
      let y = 60
      doc.text("Nome", 14, y)
      doc.text("StatusOS", 80, y)
      doc.text("Telefone", 130, y)
      y += 5
      // desenhar uma linha
      doc.setLineWidth(0.5) // expessura da linha
      doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)

      // renderizar os clientes cadastrados no banco
      y += 10 // espaçamento da linha
      // percorrer o vetor clientes(obtido do banco) usando o laço forEach (equivale ao laço for)
      clientes.forEach((c) => {
          // adicionar outra página se a folha inteira for preenchida (estratégia é saber o tamnaho da folha)
          // folha A4 y = 297mm
          if (y > 280) {
              doc.addPage()
              y = 20 // resetar a variável y
              // redesenhar o cabeçalho
              doc.text("Nome", 14, y)
              doc.text("StatusOS", 80, y)
              doc.text("Telefone", 130, y)
              y += 5
              doc.setLineWidth(0.5)
              doc.line(10, y, 200, y)
              y += 10
          }
          doc.text(c.NomeCliente, 14, y),
              doc.text(c.StatusOs, 80, y),
              doc.text(c.Telefone || "N/A", 130, y)
          y += 10 //quebra de linha
      })

      // Adicionar numeração automática de páginas
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
      }

      // Definir o caminho do arquivo temporário e nome do arquivo
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'os-aberta.pdf')
      // salvar temporariamente o arquivo
      doc.save(filePath)
      // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
      shell.openPath(filePath)
  } catch (error) {
      console.log(error)
  }
}

ipcMain.on('validate-search', () =>{
  dialog.showMessageBox({
      type: 'warning',
      title: "Atenção!!",
      message: "Preencha o campo de busca",
      buttons: ['OK']
  })
})


ipcMain.on('search-name', async(event, name)=>{
  try {
      const dataClient = await clientModel.find({
          $or: [
              {nomeCliente: new RegExp(name, 'i') },
              {cpfCliente: new RegExp(name, 'i') }
            ]
      })
      console.log(dataClient)
      if(dataClient.length === 0){
          dialog.showMessageBox({
              type:'question',
              title:"Aviso",
              message:"Cliente não cadastrado. \nDeseja Cadastrar este cliente?",
              desfaultId:0,
              buttons:['Sim', 'Não']
          }).then((result)=>{
              if(result.response === 0){
                  event.reply('set-client')
              }else{
                  event.reply('reset-form')
              }
          })
      }else{

      }
      event.reply('render-client', JSON.stringify(dataClient))
  } catch (error) {
      console.log(error)        
  }
})


ipcMain.on('delete-client', async (event, id) => {
  console.log(id) // Passo 2 (recebimento do id)
  try {
      // Confirmar a exclusão sem vincular a uma janela específica
      const { response } = await dialog.showMessageBox({
          type: 'warning',
          title: "Atenção!",
          message: "Deseja excluir este cliente?\nEsta ação não poderá ser desfeita.",
          buttons: ['Cancelar', 'Excluir'] // [0, 1]
      })

      // Se clicou em "Excluir"
      if (response === 1) {
          

          // Excluir o cliente do banco de dados
          await clientModel.findByIdAndDelete(id)
          // Pedir para o renderer limpar o formulário
          event.reply('reset-form')
      }
  } catch (error) {
      console.log(error)
  }
})
// == Fim - CRUD Delete =======================================
//===============================================
ipcMain.on('update-client', async (event, client) => {
  console.log(client) //teste importante (recebimento dos dados do cliente)
  try {
      // criar uma nova de estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser idênticos ao modelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto cliente
      const updateClient = await clientModel.findByIdAndUpdate(
          client.idCli,
          {
              nomeCliente: client.nameCli,
              cpfCliente: client.cpfCli,
              emailCliente: client.emailCli,
              foneCliente: client.phoneCli,
              cepCliente: client.cepCli,
              logradouroCliente: client.addressCli,
              numeroCliente: client.numberCli,
              complementoCliente: client.complementCli,
              bairroCliente: client.neighborhoodCli,
              cidadeCliente: client.cityCli,
              ufcCliente: client.ufcCli
          },
          {
              new: true
          }
      )
      // Mensagem de confirmação
      dialog.showMessageBox({
          //customização
          type: 'info',
          title: "Aviso",
          message: "Dados do cliente alterados com sucesso",
          buttons: ['OK']
      }).then((result) => {
          //ação ao pressionar o botão (result = 0)
          if (result.response === 0) {
              //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
              event.reply('reset-form')
          }
      })

  } catch (error) {
      console.log(error)
  }
})


ipcMain.on('listar-fios', async (event) => {
  try {
    const fios = await fiosModel.find().sort({ MarcaFios: 1 })
    event.reply('render-fios', JSON.stringify(fios))
  } catch (error) {
    console.error('Erro ao listar fios:', error)
  }
})

// ============================================================
// == Buscar OS - CRUD Read ===================================

ipcMain.on('search-os', async (event) => {
  prompt({
      title: 'Buscar OS',
      label: 'Digite o número da OS:',
      inputAttrs: {
          type: 'text'
      },
      type: 'input',
      width: 400,
      height: 200
  }).then(async (result) => {
      // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
      if (result !== null) {
          // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
          if (mongoose.Types.ObjectId.isValid(result)) {
              try {
                  const dataOS = await ordemModel.findById(result)
                  if (dataOS) {
                      console.log(dataOS) // teste importante
                      // enviando os dados da OS ao rendererOS
                      // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataOS)
                      event.reply('render-os', JSON.stringify(dataOS))
                  } else {
                      dialog.showMessageBox({
                          type: 'warning',
                          title: "Aviso!",
                          message: "OS não encontrada",
                          buttons: ['OK']
                      })
                  }
              } catch (error) {
                  console.log(error)
              }
          } else {
              dialog.showMessageBox({
                  type: 'error',
                  title: "Atenção!",
                  message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                  buttons: ['OK']
              })
          }
      }
  })
})

// == Fim - Buscar OS - CRUD Read =============================
// ============================================================

// ============================================================
// == Buscar cliente para vincular na OS(busca estilo Google) = 

ipcMain.on('search-clients', async (event) => {
  try {
      // buscar no banco os clientes pelo nome em ordem alfabética
      const clients = await clientModel.find().sort({ nomeCliente: 1 })
      //console.log(clients) // teste do passo 2
      // Passo 3: Envio dos clientes para o renderizador
      // Obs: não esquecer de converter para String
      event.reply('list-clients', JSON.stringify(clients))
  } catch (error) {
      console.log(error)
  }
})

// == Fim - Busca Cliente (estilo Google) =====================
// ============================================================

// Validação de busca (preenchimento obrigatório Id Cliente-OS)
ipcMain.on('validate-client', (event) => {
  dialog.showMessageBox({
      type: 'warning',
      title: "Aviso!",
      message: "É obrigatório vincular o cliente na Ordem de Serviço",
      buttons: ['OK']
  }).then((result) => {
      //ação ao pressionar o botão (result = 0)
      if (result.response === 0) {
          event.reply('set-search')
      }
  })
})

// ============================================================
// == Excluir OS - CRUD Delete  ===============================

ipcMain.on('delete-os', async (event, idOS) => {
  console.log(idOS) // teste do passo 2 (recebimento do id)
  try {
      //importante - confirmar a exclusão
      //osScreen é o nome da variável que representa a janela OS
      const { response } = await dialog.showMessageBox(ordem, {
          type: 'warning',
          title: "Atenção!",
          message: "Deseja excluir esta ordem de serviço?\nEsta ação não poderá ser desfeita.",
          buttons: ['Cancelar', 'Excluir'] //[0, 1]
      })
      if (response === 1) {
          //console.log("teste do if de excluir")
          //Passo 3 - Excluir a OS
          const delOS = await ordemModel.findByIdAndDelete(idOS)
          event.reply('reset-form-os')
      }
  } catch (error) {
      console.log(error)
  }
})

// == Fim Excluir OS - CRUD Delete ============================
// ============================================================


// ============================================================
// == Editar OS - CRUD Update =================================

ipcMain.on('update-os', async (event, ordem) => {
  //importante! teste de recebimento dos dados da os (passo 2)
  console.log(ordem)
  // Alterar os dados da OS no banco de dados MongoDB
  try {
      // criar uma nova de estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser idênticos ao modelo de dados OS.js e os valores são definidos pelo conteúdo do objeto os
      const updateOS = await ordemModel.findByIdAndUpdate(
          ordem.id_OS,
          {
            IdCliente:ordem.idClientOrdem,
            NomeCliente: ordem.NomeOrdem, 
            Telefone: ordem.TelefoneOrdem, 
            StatusOs: ordem.StatusOrdem, 
            Servico: ordem.ServicoOrdem,  
            Qtd: ordem.QtdOrdem, 
            Desc: ordem.DescOrdem,
            Marca: ordem.MarcaOrdem,
            Cor: ordem.CorOrdem,
            Pgmt: ordem.PgmtOrdem,
            ValorTotal: ordem.ValorTlOrdem
          },
          {
              new: true
          }
      )
      // Mensagem de confirmação
      dialog.showMessageBox({
          //customização
          type: 'info',
          title: "Aviso",
          message: "Dados da OS alterados com sucesso",
          buttons: ['OK']
      }).then((result) => {
          //ação ao pressionar o botão (result = 0)
          if (result.response === 0) {
              //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
              event.reply('reset-form-os')
          }
      })
  } catch (error) {
      console.log(error)
  }
})

// == Fim Editar OS - CRUD Update =============================
// ============================================================

// Buscar marcas únicas
ipcMain.on('get-marcas', async (event) => {
  try {
    const marcasBrutas = await fiosModel.find().select('MarcaFios -_id')

    const marcasLimpa = marcasBrutas
      .map(obj => obj.MarcaFios.trim())
    
    const marcasUnicas = [...new Set(marcasLimpa)]

    event.reply('marcas-listadas', marcasUnicas)
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
  }
})

// Buscar cores da marca selecionada
ipcMain.on('get-cores-por-marca', async (event, marca) => {
  try {
    const cores = await fiosModel.find({ MarcaFios: marca }).distinct('CorFios')
    event.reply('cores-listadas', cores)
  } catch (error) {
    console.error('Erro ao buscar cores da marca:', error)
  }
})

// editar fioos
ipcMain.on('update-fios', async (event, fios) => {
  try {
    await fiosModel.findByIdAndUpdate(fios._id, {
      CodigoFios: fios.CodigoFios,
      MarcaFios: fios.MarcaFios,
      CorFios: fios.CorFios,
      QtdFios: fios.QtdFios
    })

    dialog.showMessageBox({
      type: 'info',
      title: 'Sucesso',
      message: 'Fio atualizado com sucesso!',
      buttons: ['OK']
    }).then(() => {
      event.reply('reset-form-fios')
    })
  } catch (error) {
    console.error('Erro ao atualizar fio:', error)
  }
})

// excluir fios 
ipcMain.on('delete-fios', async (event, id) => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir este fio?',
    buttons: ['Cancelar', 'Excluir']
  })

  if (response === 1) {
    try {
      await fiosModel.findByIdAndDelete(id)
      event.reply('reset-form-fios')
    } catch (error) {
      console.error('Erro ao excluir fio:', error)
    }
  }
})


// ============================================================
// Impressão de OS ============================================

ipcMain.on('print-os', async (event) => {
  prompt({
    title: 'Imprimir OS',
    label: 'Digite o ID da OS:',
    inputAttrs: { type: 'text' },
    type: 'input',
    width: 400,
    height: 200
  }).then(async (result) => {
    if (!result) return;

    if (!mongoose.Types.ObjectId.isValid(result)) {
      return dialog.showMessageBox({
        type: 'error',
        title: "Atenção!",
        message: "Código da OS inválido. Verifique e tente novamente.",
        buttons: ['OK']
      })
    }

    try {
      const os = await ordemModel.findById(result)
      if (!os) {
        return dialog.showMessageBox({
          type: 'warning',
          title: "Aviso!",
          message: "OS não encontrada.",
          buttons: ['OK']
        })
      }

      const cliente = await clientModel.findById(os.IdCliente)
      const doc = new jsPDF('p', 'mm', 'a4')

      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x,y)
      // definir o tamanho da fonte (tamanho equivalente ao word)
      doc.setFontSize(18)
      // escrever um texto (título)
      doc.text("Ordem de Serviço", 14, 45, { align: 'center' }) // logo menor e alinhado
      // doc.setFontSize(20)
      // doc.text("Ordem de Serviço", 105, 20, { align: 'center' })

      doc.setFontSize(12)
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 170, 10)

      // Cliente
      doc.setFontSize(14)
      doc.text("Dados do Cliente:", 14, 50)
      doc.setFontSize(12)
      doc.text(`Nome: ${cliente.nomeCliente}`, 14, 58)
      doc.text(`Telefone: ${cliente.foneCliente}`, 14, 64)
      doc.text(`E-mail: ${cliente.emailCliente || 'N/A'}`, 14, 70)

      // OS
      doc.setFontSize(14)
      doc.text("Informações da OS:", 14, 85)
      doc.setFontSize(12)
      doc.text(`Status: ${os.StatusOs}`, 14, 93)
      doc.text(`Serviço: ${os.Servico}`, 14, 99)
      doc.text(`Quantidade: ${os.Qtd}`, 14, 105)
      doc.text(`Marca da Lã: ${os.Marca}`, 14, 111)
      doc.text(`Cor da Lã: ${os.Cor}`, 14, 117)
      doc.text(`Pagamento: ${os.Pgmt}`, 14, 123)
      doc.text(`Valor Total: R$ ${os.ValorTotal}`, 14, 129)

      // Descrição (com quebra de texto automática)
      doc.setFontSize(14)
      doc.text("Descrição:", 14, 140)
      doc.setFontSize(12)
      const descricaoFormatada = doc.splitTextToSize(os.Desc, 180)
      doc.text(descricaoFormatada, 14, 147)

      // Termo de garantia
      doc.setFontSize(10)
      const termo = `
Termo de Serviço e Garantia

O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:

- Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
- Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
- A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do CDC, e cobre exclusivamente o reparo executado ou peça trocada.
- Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
- Equipamentos não retirados em até 90 dias estarão sujeitos a armazenagem ou descarte (Art. 1.275 do CC).
- O cliente declara estar ciente e de acordo com os termos acima.`
      const termoFormatado = doc.splitTextToSize(termo, 180)
      doc.text(termoFormatado, 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 170)

      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'os.pdf')
      doc.save(filePath)
      shell.openPath(filePath)

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    }
  })
})

