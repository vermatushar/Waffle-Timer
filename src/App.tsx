import React from 'react';
import { FloatingWidget } from './components/FloatingWidget';
import './styles.css';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent">
      <FloatingWidget />
    </div>
  );
}

export default App;