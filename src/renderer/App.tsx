import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
  }
}

function Hello() {
  const [crawlerOutput, setCrawlerOutput] = useState<string[]>([]);

  const handleRunCrawler = () => {
    setCrawlerOutput([]);
    window.electron.ipcRenderer.send('run-crawler');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('crawler-output', (output: string) => {
      setCrawlerOutput((prevOutput) => [...prevOutput, output]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('crawler-output');
    };
  }, []);

  const formatOutput = (output: string[]) => {
    return output.map((line, index) => {
      if (line.includes('INFO')) {
        const [, content] = line.split('INFO');
        return (
          <div key={index} className="text-green-600">
            {content.trim()}
          </div>
        );
      }
      if (line.includes('Error:')) {
        return (
          <div key={index} className="text-red-600">
            {line}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-4">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">
        electron-react-boilerplate
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleRunCrawler}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Run Crawler
        </button>
      </div>
      <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-100 font-mono whitespace-pre-wrap break-words">
        {formatOutput(crawlerOutput)}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
