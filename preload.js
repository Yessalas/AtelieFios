/**
 * Arquivos de pré carregamento 
 */
const {contextBridge, ipcRenderer}= require('electron')

// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow:() => ipcRenderer.send('client-window'),
    ordemsWindow:() => ipcRenderer.send('ordems-window'),
    fiosWindow:() => ipcRenderer.send('fios-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client)
})