console.log('Hello from Electron.')

const { app, BrowserWindow, nativeTheme } = require('electron')
// nativeTheme.themeSource = 'light'
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/trico.png',
    resizable: false
  })

  win.loadFile('./src/views/index.html')
}

app.whenReady().then(() => {
  createWindow()
})