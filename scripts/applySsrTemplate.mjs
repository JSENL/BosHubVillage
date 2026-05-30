/**
 * Merge SSR render output into index.html template.
 */
export function applySsrTemplate(template, { appHtml, headHtml, prefetchScript }) {
  let html = template.replace('<!--ssr-outlet-->', appHtml);

  if (headHtml) {
    html = html.replace(/<!--ssr-head-start-->[\s\S]*?<!--ssr-head-end-->/, headHtml);
  } else {
    html = html
      .replace('<!--ssr-head-start-->', '')
      .replace('<!--ssr-head-end-->', '');
  }

  if (prefetchScript) {
    html = html.replace('<!--ssr-prefetch-data-->', prefetchScript);
  } else {
    html = html.replace('<!--ssr-prefetch-data-->', '');
  }

  return html;
}
