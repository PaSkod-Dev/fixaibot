# Guide Développeur - FIXƆ

Documentation technique pour les développeurs souhaitant contribuer ou comprendre l'architecture du projet.

## Architecture

### Vue d'ensemble

FIXƆ suit une architecture modulaire basée sur des composants JavaScript vanilla (sans framework). L'application est organisée en trois couches principales :

- **Components** : Composants UI réutilisables
- **Services** : Logique métier et intégrations API
- **Utils** : Fonctions utilitaires partagées

### Structure détaillée

```
fixo-frontend/
├── scripts/
│   ├── app.js                    # Point d'entrée, initialisation
│   ├── components/
│   │   ├── Chat.js               # Interface de chat
│   │   ├── Settings.js           # Panneau de paramètres
│   │   └── Help.js               # Centre d'aide
│   ├── services/
│   │   ├── mode-lite.js          # Base de connaissances locale
│   │   ├── mode-core.js          # Intégration API Groq
│   │   └── mode-pro.js           # Fonctionnalités avancées
│   └── utils/
│       ├── storage.js            # Gestion localStorage
│       ├── markdown.js           # Parsing Markdown
│       ├── constants.js          # Constantes globales
│       └── dom.js                # Manipulation DOM
├── styles/
│   ├── variables.css             # Variables CSS (couleurs, espacements)
│   ├── base.css                  # Styles de base
│   ├── components.css            # Styles des composants
│   ├── markdown.css              # Styles Markdown
│   ├── help.css                  # Styles centre d'aide
│   └── themes/
│       ├── light.css             # Thème clair
│       └── dark.css              # Thème sombre
└── data/
    └── knowledge-base.json       # Base de connaissances Mode Lite
```

## Composants principaux

### Chat.js

Gère l'interface de conversation et l'affichage des messages.

**Méthodes clés** :
- `ajouterMessage(contenu, role)` : Ajoute un message au chat
- `afficherTyping()` : Affiche l'indicateur de saisie
- `cacherTyping()` : Masque l'indicateur

**Événements** :
- Envoi de message (Enter ou clic bouton)
- Auto-resize du textarea
- Scroll automatique

### Settings.js

Panneau de configuration avec gestion des modes et des préférences.

**Fonctionnalités** :
- Sélection du mode (Lite/Core/Pro)
- Configuration API
- Changement de thème
- Effacement de l'historique

### Help.js

Centre d'aide avec navigation par onglets.

**Sections** :
- Accueil
- Configuration API
- Modes d'assistance
- FAQ

## Services

### mode-lite.js

Service pour le mode hors ligne avec base de connaissances locale.

```javascript
// Exemple d'utilisation
import ModeLite from './services/mode-lite.js';

const response = await ModeLite.traiterQuestion(userMessage);
console.log(response);
```

**Fonctionnement** :
1. Analyse de la question utilisateur
2. Recherche par mots-clés dans knowledge-base.json
3. Retour de la réponse la plus pertinente

### mode-core.js

Intégration avec l'API Groq pour l'intelligence artificielle.

```javascript
// Exemple d'utilisation
import ModeCore from './services/mode-core.js';

const response = await ModeCore.envoyerMessage(userMessage, apiKey);
console.log(response);
```

**Configuration API** :
- Provider : Groq
- Modèle : llama-3.1-70b-versatile
- Endpoint : https://api.groq.com/openai/v1/chat/completions

## Gestion des données

### LocalStorage

Toutes les données sont stockées localement dans le navigateur :

```javascript
// Structure des données
{
  "fixo_mode": "lite|core|pro",
  "fixo_theme": "light|dark|auto",
  "fixo_api_key": "gsk_...",
  "fixo_api_provider": "groq",
  "fixo_historique": [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

### Sécurité

- Les clés API sont stockées en clair dans localStorage (côté client uniquement)
- Aucune donnée n'est envoyée à un serveur backend
- Les requêtes API sont faites directement depuis le navigateur

## Markdown et syntaxe

### Parser Markdown

Utilise `marked.js` avec extensions personnalisées :

```javascript
import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: (code, lang) => {
    return hljs.highlight(code, { language: lang }).value;
  }
});
```

### Fonctionnalités Markdown

- Tables avec styles responsive
- Blocs de code avec coloration syntaxique
- Bouton de copie sur les blocs de code
- Support des listes, liens, images

## Styles et thèmes

### Variables CSS

Toutes les couleurs et espacements sont définis dans `variables.css` :

```css
:root {
  --couleur-accent: #f59e0b;
  --couleur-fond: #0f172a;
  --espace-2: 0.5rem;
  --rayon-md: 0.5rem;
}
```

### Thèmes

Les thèmes sont appliqués via des classes sur `<body>` :

```javascript
document.body.classList.add('theme-dark');
// ou
document.body.classList.add('theme-light');
```

## Développement

### Prérequis

- Node.js 16+ (optionnel, pour les outils de build)
- Éditeur de code (VS Code recommandé)
- Extension Live Server

### Workflow de développement

1. **Créer une branche** :
```bash
git checkout -b feature/nouvelle-fonctionnalite
```

2. **Développer et tester** :
- Modifier les fichiers
- Tester dans le navigateur
- Vérifier la console pour les erreurs

3. **Commit et push** :
```bash
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

4. **Créer une Pull Request**

### Conventions de code

**JavaScript** :
- Utiliser `const` et `let`, jamais `var`
- Noms de variables en camelCase
- Noms de classes en PascalCase
- Commentaires JSDoc pour les fonctions publiques

**CSS** :
- Utiliser les variables CSS
- Noms de classes en kebab-case
- Éviter les IDs pour le style
- Mobile-first pour le responsive

**Commits** :
- Format : `type: description`
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`

## Tests

### Tests manuels

Checklist avant chaque release :

- [ ] Mode Lite fonctionne hors ligne
- [ ] Mode Core avec clé API valide
- [ ] Changement de thème
- [ ] Responsive (mobile, tablette, desktop)
- [ ] Copie de code
- [ ] Tables Markdown
- [ ] Centre d'aide

### Tests navigateurs

Tester sur :
- Chrome/Edge (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Mobile (iOS Safari, Chrome Android)

## Déploiement

### Build pour production

Aucun build nécessaire, le projet est prêt pour le déploiement direct.

### GitHub Pages

1. Pousser sur la branche `main`
2. GitHub Pages sert automatiquement depuis la racine
3. L'URL sera : `https://username.github.io/FixoBot/`

### Variables d'environnement

Aucune variable d'environnement côté serveur. Les clés API sont gérées côté client.

## Contribution

### Ajouter un nouveau mode

1. Créer `scripts/services/mode-nouveau.js`
2. Implémenter la méthode `traiterQuestion(message)`
3. Ajouter l'option dans `Settings.js`
4. Mettre à jour `constants.js`

### Ajouter une fonctionnalité

1. Identifier le composant concerné
2. Créer une branche feature
3. Implémenter et tester
4. Documenter dans le code
5. Créer une PR

## Ressources

- [API Groq](https://console.groq.com/docs)
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [Lucide Icons](https://lucide.dev/)

## Support

Pour toute question technique :
- Ouvrir une issue sur GitHub
- Consulter les discussions existantes
- Contacter l'équipe de développement

---

Dernière mise à jour : Décembre 2025