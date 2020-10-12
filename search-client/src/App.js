import React from 'react';
import { Input } from 'semantic-ui-react'
import './App.css';

const placeholders = ["he greeted death...", "the ones we love...", "dark times lie ahead..."]
function App() {
  return (
    <div className="centred">
      <div className="bg-box">
        <h1 className="header">Potter Search</h1>
        <p className="subtitle">Search the full text of your favorite books.</p>
        <Input action={{ icon: 'search' }} placeholder='Search...' />
      </div>
    </div>
  );
}

export default App;
