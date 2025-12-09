/**
 * Script pour générer index.html à la racine avec les bons chemins
 * Pour déploiement GitHub Pages
 */

const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'fixaibot', 'fixo-frontend', 'index.html');
const targetFile = path.join(__dirname, 'index.html');

console.log('Génération de index.html pour GitHub Pages...');

// Lire le fichier source
let content = fs.readFileSync(sourceFile, 'utf8');

// Remplacer tous les chemins relatifs
const replacements = [
  { from: 'href="assets/', to: 'href="fixaibot/fixo-frontend/assets/' },
  { from: 'href="manifest.json"', to: 'href="fixaibot/fixo-frontend/manifest.json"' },
  { from: 'href="styles/', to: 'href="fixaibot/fixo-frontend/styles/' },
  { from: 'src="scripts/', to: 'src="fixaibot/fixo-frontend/scripts/' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(new RegExp(from, 'g'), to);
});

// Ajouter une variable globale pour le base path
const basePathScript = `
    <!-- Base path configuration for GitHub Pages -->
    <script>
      window.FIXO_BASE_PATH = './fixaibot/fixo-frontend/';
    </script>
  </head>`;

content = content.replace('</head>', basePathScript);

// Écrire le fichier de destination
fs.writeFileSync(targetFile, content, 'utf8');

console.log('✅ Fichier index.html généré avec succès à la racine!');
console.log(' Chemins ajustés pour: fixaibot/fixo-frontend/');