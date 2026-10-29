/**
 * Servidor de desarrollo local ultra-ligero con Live Reload
 * Sin dependencias externas (ideal para Google Drive y GitHub Pages)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const clients = [];

// Watcher para recarga en vivo
fs.watch(ROOT, { recursive: true }, (eventType, filename) => {
  if (!filename || filename.includes('.git') || filename.includes('dev-server.js')) return;
  while (clients.length > 0) {
    const client = clients.pop();
    try {
      client.write('data: reload\n\n');
      client.end();
    } catch (_) {}
  }
});

const server = http.createServer((req, res) => {
  // Endpoint de Live-Reload
  if (req.url === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    clients.push(res);
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT, reqPath);

  // Soporte para URLs sin .html
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 No encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      fs.readFile(filePath, 'utf8', (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Error al leer el archivo');
          return;
        }
        // Inyectar script de auto-reload
        const reloadScript = '<script>new EventSource("/__reload").onmessage=()=>location.reload();</script>';
        const modified = content.includes('</body>')
          ? content.replace('</body>', reloadScript + '</body>')
          : content + reloadScript;

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(modified);
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🚀 Chapa Tu Técnico - Servidor Local`);
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  🔄 Live Reload: Activado`);
  console.log(`  📁 Raíz: ${ROOT}`);
  console.log(`======================================================\n`);
});
