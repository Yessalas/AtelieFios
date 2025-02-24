//console.log('Hello from Electron.')

const { app, BrowserWindow, nativeTheme, Menu } = require('electron')
// nativeTheme.themeSource = 'light'

// -------------- Janela Principal ----------------------------------------
const createWindow = () => {
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/trico.png',
    resizable: false
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
        width: 360,
        height: 250,
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
function clientWindows(){
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtém a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let client
  // Estabelecer hierarquica entre janelas
  if (main){
    // criar a janela sobre
    client = new BrowserWindow({
        width: 500,
        height: 300,
        icon: './src/public/img/trico.png',
        autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        parent: main,
        modal: true
    })
  }
  client.loadFile('./src/views/cliente.html')
}
// -------------------------- Fim Janela Cliente ------------------------------------------------
app.whenReady().then(() => {
  createWindow()
  //aboutWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow()
    
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit()
})

// ----------------------------- Menu --------------------------------------------------
const template = [
  {
      label: 'Cadastro',
      submenu:[
        {
          label: 'Clientes',
          click: () => clientWindows()
        },
        {
          label: 'OS'
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