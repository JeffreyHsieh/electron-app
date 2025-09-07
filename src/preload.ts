import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
});
