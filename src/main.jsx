import React from 'react';
import ReactDOM from 'react-dom';
import { TransactionProvider } from './context/TransactionContext';
import App from './App';
import './index.css';

ReactDOM.render(
  <TransactionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TransactionProvider>,
  document.getElementById('root')
);
