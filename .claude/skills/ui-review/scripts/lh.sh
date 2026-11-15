#!/bin/sh
# Uso: sh lh.sh <url> <etiqueta>   -> .ui-review/lighthouse/<etiqueta>-{mobile,desktop}.json + resumen
URL=${1:-http://localhost:3000/}; TAG=${2:-run}
export CHROME_PATH=${CHROME_PATH:-$(ls -d "$LOCALAPPDATA"/ms-playwright/chromium-*/chrome-win*/chrome.exe 2>/dev/null | tail -1)}
mkdir -p .ui-review/lighthouse
for mode in mobile desktop; do
  extra=""; [ "$mode" = desktop ] && extra="--preset=desktop"
  npx -y lighthouse@12.2.1 "$URL" $extra --output=json --output-path=".ui-review/lighthouse/$TAG-$mode.json" \
    --chrome-flags="--headless=new --no-sandbox" --quiet >/dev/null 2>&1
  node -e "const r=require('./.ui-review/lighthouse/$TAG-$mode.json');const c=r.categories,a=r.audits;console.log('$TAG $mode | '+Object.values(c).map(x=>x.title+' '+Math.round(x.score*100)).join(' | ')+' | LCP '+a['largest-contentful-paint'].displayValue+' | CLS '+a['cumulative-layout-shift'].displayValue+' | TBT '+a['total-blocking-time'].displayValue+' | peso '+a['total-byte-weight'].displayValue)"
done
