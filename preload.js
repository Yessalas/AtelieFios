/**
 * Arquivos de pré carregamento 
 */
const { contextBridge, ipcRenderer } = require('electron')

// Enviar ao main um pedido para conexão com o banco de dados e troca do ícone no processo de rendirzação (index.html - renderer.html)
ipcRenderer.send('db-connect')

// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-window'),
    ordemsWindow: () => ipcRenderer.send('ordems-window'),
    fiosWindow: () => ipcRenderer.send('fios-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    newOrdem: (ordem) => ipcRenderer.send('new-ordem', ordem),
    resetForm: (args) => ipcRenderer.on('reset-form', args)
 })