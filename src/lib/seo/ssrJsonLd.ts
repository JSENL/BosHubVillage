/** Id on JSON-LD injected during SSR (see buildSsrHeadHtml). */
export const SSR_JSON_LD_SCRIPT_ID = 'ssr-jsonld';

export function hasSsrJsonLd(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(document.getElementById(SSR_JSON_LD_SCRIPT_ID));
}
