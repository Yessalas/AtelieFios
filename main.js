//console.log('Hello from Electron.')

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

const path= require('node:path')
// nativeTheme.themeSource = 'light'

// Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// importação do schema clientes da camada model
const clientModel = require ('./src/models/cliente.js')
const ordemModel = require ('./src/models/ordem.js')

// importaçpão do pacote jspdf (npm i jspdf)
const {jspdf, default: jsPDF}= require('jspdf')
// importação da biblioteca fs (nativa do javascript)par manipulação de arquivos (no caso arquivos pdf)
const fs = require ('fs')

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
          title: "Aviso !",
          message: "Cliente adicionado com sucesso",
          buttons:['OK']
          }).then((result)=>{
          if(result.response === 0 ){
              // enviar um pedido para o renderizador limpar os campos de resetar
              // as configurações pré  definidas(rótulo 'reset - form)
              event.reply('reset-form')
          }
      })
  } catch (error) {
    if (error.code === 11000){
      dialog.showMessageBox({
          type:'erro',
          title:"Atenção!",
          message:"CPF já está cadastrado \n Verifique se digitou corretamente",
          buttons:['OK']
      }).then((result)=> {
          if(result.response === 0 ){
              //
          }
      })
  }
      console.log(error)
  }
})

ipcMain.on('new-ordem', async (event, ordems) =>{
  console.log(ordems)
  try {
    const newOrdem = new ordemModel({
      numOsOrdem: ordems.numOsOrdem, 
      numSerieOrdem: ordems.numSerieOrdem, 
      DtEntradaOrdem: ordems.DtEntradaOrdem, 
      DtSaidaOrdem: ordems.DtSaidaOrdem, 
      NomeOrdem: ordems.NomeOrdem, 
      TelefoneOrdem: ordems.TelefoneOrdem, 
      CPFOrdem: ordems.CPFOrdem,
      StatusOrdem: ordems.StatusOrdem, 
      ServicoOrdem: ordems.ServicoOrde.value, 
      QtdOrdem: ordems.QtdOrdem, 
      MarcaOrdem: ordems.MarcaOrdem,
      PgmtOrdem: ordems.PgmtOrdem,
      ValorTlOrdem: ordems.ValorTlOrdem
  })
  await newOrdem.save() 
  } catch (error) {
    console.log(error)
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