import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize i18n after React is loaded
import('./i18n/config').then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
