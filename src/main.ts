import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Enable preload if needed
      nodeIntegration: false,
      contextIsolation: true, // required for security
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
}

app.whenReady().then(() => {
  createWindow();
});

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  }
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return result?.updateInfo || null;
  } catch (err) {
    console.error('Update check failed:', err);
    return null;
  }
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded, preparing to install...');

  // Close main window first
  if (mainWindow) {
    mainWindow.close();
  }

  // Delay quit-and-install so app can exit fully
  setTimeout(() => {
    autoUpdater.quitAndInstall(true, true);
  }, 5000); // 1-second delay before triggering installer
});
