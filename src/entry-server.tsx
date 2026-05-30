import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import './index.css';
import './i18n/config';
import { SsrPrefetchProvider } from '@/contexts/SsrPrefetchContext';
import {
  buildSsrHeadHtml,
  buildSsrPrefetchScript,
  fetchPrefetchForUrl,
} from '@/lib/ssr/fetchPrefetch';

export interface SsrRenderResult {
  appHtml: string;
  headHtml: string;
  prefetchScript: string;
}

export async function render(url: string): Promise<SsrRenderResult> {
  const { payload, head } = await fetchPrefetchForUrl(url);

  const appHtml = renderToString(
    <StaticRouter location={url}>
      <SsrPrefetchProvider value={payload}>
        <App />
      </SsrPrefetchProvider>
    </StaticRouter>
  );

  return {
    appHtml,
    headHtml: buildSsrHeadHtml(head),
    prefetchScript: buildSsrPrefetchScript(payload),
  };
}
