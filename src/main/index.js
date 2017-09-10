import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron' // eslint-disable-line
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

function createMenuTemplate(app, shell) {
  const menuTemplate = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('http://electron.atom.io');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();

    menuTemplate.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${name}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            app.quit();
          },
        },
      ],
    });

    const windowMenu = menuTemplate.find(m => m.role === 'window');

    if (windowMenu) {
      windowMenu.submenu.push({
        type: 'separator',
      });
      windowMenu.submenu.push({
        label: 'Bring All to Front',
        role: 'front',
      });
    }
  }

  return menuTemplate;
}

function createMenu() {
  const menu = createMenuTemplate(app, shell);

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

app.on('ready', () => {
  createWindow();
  createMenu();
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
