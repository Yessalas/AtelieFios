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
    newFios: (fios) => ipcRenderer.send('new-fios', fios),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    resetFormOs: (callback) => ipcRenderer.on('reset-form-os', callback),
    listarFios: () => ipcRenderer.send('listar-fios'),
    renderFios: (callback) => ipcRenderer.on('render-fios', (event, data) => callback(data)),
    resetFormFios: (args) => ipcRenderer.on('reset-form-fios', args),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (dataClient) => ipcRenderer.on('render-client', dataClient),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send('delete-client', id),
    updateClient: (client) => ipcRenderer.send('update-client', client),
    searchOS: () => ipcRenderer.send('search-os'),
    searchClients: () => ipcRenderer.send('search-clients'),
    renderOS: (callback) => ipcRenderer.on('render-os', (event, data) => callback(event, data)),
    validateClient: () => ipcRenderer.send('validate-search'),
    listClients: (clients) => ipcRenderer.on('list-clients', clients),
    setSearch: (args) => ipcRenderer.on('set-search', args),
    deleteOS: (idOS) => ipcRenderer.send('delete-os', idOS),
    updateOS: (os) => ipcRenderer.send('update-os', os)
    
 })