import React from 'react';
import { FloatingWidget } from './components/FloatingWidget';
import './styles.css';

function App() {
  return (
    <div className="h-screen w-screen bg-transparent overflow-hidden antialiased">
      <FloatingWidget />
    </div>
  );
}

export default App;