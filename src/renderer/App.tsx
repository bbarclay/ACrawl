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
          <div key={index} style={{ color: 'green' }}>
            {content.trim()}
          </div>
        );
      }
      if (line.includes('Error:')) {
        return (
          <div key={index} style={{ color: 'red' }}>
            {line}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>
        electron-react-boilerplate
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <button
          onClick={handleRunCrawler}
          style={{
            backgroundColor: '#1E90FF',
            color: 'white',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Run Crawler
        </button>
      </div>
      <div style={{
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        padding: '16px',
        maxHeight: '384px',
        overflowY: 'auto',
        backgroundColor: '#F3F4F6',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
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