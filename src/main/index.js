import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import { image } from 'qr-image';
import { join as joinPath } from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = joinPath(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file:///${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 755,
    height: 563,
    useContentSize: true,
    resizable: process.env.NODE_ENV === 'development',
    frame: false, // process.env.NODE_ENV === 'development',
    backgroundColor: '#e0e5e6',
  });
  mainWindow.loadURL(winURL);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('encode-text', (ev, text) => {
  const task = image(text, { type: 'svg' });
  let data = '';

  task.on('data', (chunk) => {
    data += chunk;
  });
  task.on('end', () => ev.sender.send('encode-text-done', {
    text,
    data,
  }));
  task.on('error', err => ev.sender.send('encode-text-error', err));
});
