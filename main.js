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
function ordemsWindow(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let ordem
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela OS
    ordem = new BrowserWindow({
        width: 1015,
        height: 1010,
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
        width: 900,
        height: 700,
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
          label:'OS abertas'
        },
        {
          label:'Os concluidas'
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
      numOs: ordem.numOsOrdem, 
      numSerie: ordem.numSerieOrdem, 
      DtEntrada: ordem.DtEntradaOrdem, 
      DtSaida: ordem.DtSaidaOrdem, 
      NomeCliente: ordem.NomeOrdem, 
      Telefone: ordem.TelefoneOrdem, 
      CPF: ordem.CPFOrdem,
      StatusOs: ordem.StatusOrdem, 
      Servico: ordem.ServicoOrdem,  
      Qtd: ordem.QtdOrdem, 
      Desc: ordem.DescOrdem,
      Marca: ordem.MarcaOrdem,
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
       const clientes = await clientModel.find().sort({
           nomeCliente:1
       })
       const doc = new jsPDF('p', 'mm', 'a4')

       const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
       const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64'})
       doc.addImage(imageBase64, 'PNG', 5 ,8)  



       doc.setFontSize(16)
       doc.text("Relatório do cliente", 14,40)

       const dataAtual = new Date().toLocaleDateString('pt-BR')
       doc.setFontSize(12)
       doc.text(`Data:${dataAtual}`, 160, 10)
       let y = 60
       doc.text("Nome",14, y)
       doc.text("Telefone", 80, y)
       doc.text("E-mail", 130, y)

      y+= 5
      doc.setLineWidth(0.5)
      doc.line(10,y,200,y)
      y += 10


       clientes.forEach((c) =>{
           if(y > 280){
               doc.appPage()
               y = 20;
               doc.text("Nome",14, y)
               doc.text("Telefone", 80, y)
               doc.text("E-mail", 130, y)
               y += 5
               doc.setLineWidth(0.5)
               doc.line(10,y,200,y)
               y += 10


           }
           doc.text(c.nomeCliente, 14, y)
           doc.text(c.foneCliente, 80, y)
           doc.text(c.emailCliente ||"N/A", 130, y)

           y+=10
       })

       const paginas = doc.internal.getNumberOfPages()
       for (let i = 1 ; i <= paginas; i++){
           doc.setPage(i)
           doc.setFontSize(10)
           doc.text(`Página ${i} de ${paginas}`, 105,290, {align: 'center' })
       }

       const tempDir = app.getPath('temp')
       const filePath = path.join(tempDir, 'client.pdf')
       doc.save(filePath)
       shell.openPath(filePath)
       // teste de recebimento das listagens 
       // console.log(clientes)
  } catch (error) {
   console.log(error)
  } 
}