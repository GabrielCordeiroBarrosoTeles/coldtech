// Simple build script for Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Create a simple JavaScript bundle
const jsContent = `
// Simple bundle for Vercel deployment
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="text-align:center;padding:50px;"><h1>ColdTech</h1><p>Carregando aplicação...</p></div>';
  }
});
`;

fs.writeFileSync(path.join('dist', 'bundle.js'), jsContent);

// Create a simple CSS file
const cssContent = `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7fa;
  color: #333;
}
`;

fs.writeFileSync(path.join('dist', 'styles.css'), cssContent);

// Update index.html to include the bundle and styles
const indexHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="ColdTech - Serviços de climatização e refrigeração" />
    <title>ColdTech - Climatização e Refrigeração</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/bundle.js"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join('dist', 'index.html'), indexHtml);

console.log('Build completed successfully!');