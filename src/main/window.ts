import path from 'path';
import { BrowserWindow, shell, app } from 'electron';
import { resolveHtmlPath } from './resolveHtmlPath';
import { log } from './main';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const createWindow = (): BrowserWindow => {
  log('Creating main window');
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  log('Creating BrowserWindow');
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  log('Loading URL');
  mainWindow
    .loadURL(resolveHtmlPath('index.html'))
    .then(() => log('URL loaded successfully'))
    .catch((err) => {
      log(`Failed to load index.html: ${err}`);
    });

  mainWindow.webContents.on(
    'did-fail-load',
    (event, errorCode, errorDescription) => {
      log(`Failed to load: ${errorCode} - ${errorDescription}`);
    },
  );

  mainWindow.on('ready-to-show', () => {
    log('Window ready to show');
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    log('Window shown');
  });

  // Open DevTools in development mode
  if (isDebug) {
    log('Opening DevTools');
    mainWindow.webContents.openDevTools();
  }

  // Open external URLs in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    log(`Opening external URL: ${edata.url}`);
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  log('Main window created');
  return mainWindow;
};
