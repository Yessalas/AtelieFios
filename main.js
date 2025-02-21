//console.log('Hello from Electron.')

const { app, BrowserWindow, nativeTheme } = require('electron')
// nativeTheme.themeSource = 'light'

// -------------- Janela Principal ----------------------------------------
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/trico.png',
    resizable: false
  })

  win.loadFile('./src/views/index.html')
}
// ----------------- Fim janela principar-------------------------------------

// ------------------- Janela Sobre -----------------------------------
const aboutWindow = () => {
  const about = new BrowserWindow({
    width:360,
    height:220,
    icon:'./src/public/img/trico.png',
    autoHideMenuBar:true,
    resizable: false
  })
  about.loadFile('./src/views/sobre.html')
}


// ------------------------------------------------------
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