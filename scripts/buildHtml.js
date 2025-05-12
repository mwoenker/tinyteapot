const { readFileSync, writeFileSync } = require('fs');

function main() {
    const js = readFileSync('build/scripts/index.js').toString('utf-8');
    const html = readFileSync('assets/index.html').toString('utf-8');
    const combined = html.replace(/<script.*<\/script>/, `<script>${js}</script>`);
    writeFileSync('build/combined.html', combined);
    console.log('Wrote combined HTML file');
}
    
main();
