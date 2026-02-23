import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n/config';

const container = document.getElementById('root')!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Hydrate when server-rendered content exists (first child is not a comment), otherwise render (SPA)
const hasSSRContent = container.firstChild && container.firstChild.nodeType !== 8; // 8 = COMMENT_NODE
if (hasSSRContent) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
