//console.log('Hello from Electron.')

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

const path= require('node:path')
// nativeTheme.themeSource = 'light'

// Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// importação do schema clientes da camada model
const clientModel = require ('./src/models/cliente.js')

// -------------- Janela Principal ----------------------------------------
const createWindow = () => {
  nativeTheme.themeSource = 'light'
  let win = new BrowserWindow({
    width: 800,
    height:600,
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
      width: 900,
      height: 750,
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
  let ordems
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela OS
    ordems = new BrowserWindow({
        width: 1015,
        height: 1010,
        icon: './src/public/img/trico.png',
        autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true
    })
  }
  ordems.loadFile('./src/views/ordem.html')
  ordems.center()
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
        autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true
    })
  }
  fios.loadFile('./src/views/fios.html')
  fios.center()
}
// -------------------------- Fim Janela OS (ordem de serviço) ------------------------------------------------
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
          label:'Clientes'
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
  } catch (error) {
      console.log(error)
  }
})
