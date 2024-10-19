import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering App:', error);
  document.body.innerHTML = `<h1>Error rendering application</h1><pre>${error}</pre>`;
}

// calling IPC exposed from preload script
window.electron.ipcRenderer.on('ipc-example', (arg: any) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.send('ipc-example', ['ping']);
