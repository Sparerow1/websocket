import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
        console.log('Connected to WebSocket');
    };
    
    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };
    
    ws.onclose = () => {
        console.log('Disconnected from WebSocket');
    };
    
    // Send a message
    ws.send('Hello from React!');
    
    return () => {
        ws.close();
    };
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
