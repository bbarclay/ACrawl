import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';

export const defaultConfig = {
  url: 'https://www.builder.io/c/docs/developers',
  match: 'https://www.builder.io/c/docs/**',
  selector: `.docs-builder-container`,
  maxPagesToCrawl: 5,
  outputFileName: 'folder/output.json',
};

const runCrawler = (mainWindow: BrowserWindow) => {
  const configArgs = [
    '--url',
    defaultConfig.url,
    '--match',
    defaultConfig.match,
    '--selector',
    defaultConfig.selector,
    '--maxPagesToCrawl',
    defaultConfig.maxPagesToCrawl.toString(),
    '--outputFileName',
    defaultConfig.outputFileName,
  ];

  const crawler = spawn('npx', ['gpt-crawler', ...configArgs]);

  crawler.stdout.on('data', (data) => {
    const output = data.toString();
    mainWindow.webContents.send('crawler-output', output);
  });

  crawler.stderr.on('data', (data) => {
    const error = data.toString();
    mainWindow.webContents.send('crawler-output', `Error: ${error}`);
  });

  crawler.on('close', (code) => {
    mainWindow.webContents.send(
      'crawler-output',
      `Crawler process exited with code ${code}`,
    );
  });
};

export default runCrawler;
