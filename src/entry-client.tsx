import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n/config';
import {
  readSsrPrefetchScript,
  SsrPrefetchProvider,
} from '@/contexts/SsrPrefetchContext';

const container = document.getElementById('root')!;
const ssrPrefetch = readSsrPrefetchScript();

const app = (
  <SsrPrefetchProvider value={ssrPrefetch}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SsrPrefetchProvider>
);

const hasSSRContent = container.firstChild && container.firstChild.nodeType !== 8;
if (hasSSRContent) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
