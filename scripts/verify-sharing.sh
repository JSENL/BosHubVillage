#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://bos-hub-village.vercel.app}"
EVENT_PATH="${2:-/event/who-are-we-photo-project}"

echo "== Sharing/Robots/SSL verification =="
echo "Base URL: ${BASE_URL}"
echo "Event path: ${EVENT_PATH}"
echo

echo "1) robots.txt"
curl -sS "${BASE_URL}/robots.txt"
echo
echo

echo "2) Event URL with fbclid (headers)"
curl -I -sS "${BASE_URL}${EVENT_PATH}?fbclid=test123" | sed -n '1,20p'
echo

echo "3) Normal event URL (headers)"
curl -I -sS "${BASE_URL}${EVENT_PATH}" | sed -n '1,20p'
echo

echo "4) Facebook crawler user-agent (headers)"
curl -I -sS \
  -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" \
  "${BASE_URL}${EVENT_PATH}" | sed -n '1,20p'
echo

echo "5) Meta crawler user-agent (headers)"
curl -I -sS \
  -A "meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)" \
  "${BASE_URL}${EVENT_PATH}" | sed -n '1,20p'
echo

echo "6) TLS certificate"
echo | openssl s_client -servername "$(echo "${BASE_URL}" | sed -E 's#https?://([^/]+).*#\1#')" \
  -connect "$(echo "${BASE_URL}" | sed -E 's#https?://([^/]+).*#\1#'):443" 2>/dev/null | \
  openssl x509 -noout -issuer -subject -dates
echo

echo "Done."
