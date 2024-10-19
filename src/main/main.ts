import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { createWindow } from './window';
import './ipc';
import { AppUpdater } from './updater';
import runCrawler from './crawlerlogic/crawler';

const logFile = path.join(app.getPath('userData'), 'app.log');
export const log = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}
`;
  fs.appendFileSync(logFile, logMessage);
  console.log(message);
};

let mainWindow: BrowserWindow | null = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  log('App is ready');
  try {
    mainWindow = createWindow();
    log('Main window created');
    new AppUpdater(); // Initialize the updater
    log('AppUpdater initialized');

    app.on('activate', () => {
      log('App activated');
      if (mainWindow === null) {
        mainWindow = createWindow();
        log('Main window recreated');
      }
    });
  } catch (error) {
    log(`Error during app initialization: ${error}`);
  }
});

ipcMain.on('run-crawler', () => {
  if (mainWindow) {
    runCrawler(mainWindow);
  }
});
