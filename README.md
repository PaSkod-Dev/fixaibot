# FIXƆ - Assistant de Dépannage Informatique

Assistant intelligent de support technique accessible 24/7, conçu pour les universités.

## Description

FIXƆ est une application web progressive qui fournit une assistance technique instantanée aux étudiants et au personnel universitaire. Le système propose trois modes d'assistance adaptés aux différents besoins et contextes.

## Fonctionnalités principales

- **Mode Lite** : Base de connaissances locale, fonctionne hors ligne
- **Mode Core** : Intelligence artificielle avec API Groq (gratuit)
- **Mode Pro** : Fonctionnalités avancées (à venir)
- **Interface responsive** : Compatible mobile, tablette et desktop
- **Thèmes** : Mode clair, sombre et automatique
- **Markdown avancé** : Tables, code avec coloration syntaxique, copie en un clic
- **Centre d'aide** : Guide intégré pour les utilisateurs

## Installation

### Prérequis

- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local pour le développement (Live Server, http-server, etc.)

### Démarrage rapide

1. Cloner le dépôt :
```bash
git clone https://github.com/PaSkod-Dev/fixaibot.git
cd fixaibot
```

2. Ouvrir avec un serveur local :
```bash
# Option 1 : Avec Live Server (VS Code)
# Clic droit sur index.html > Open with Live Server

# Option 2 : Avec http-server (Node.js)
npx http-server -p 8080

# Option 3 : Avec Python
python -m http.server 8080
```

3. Accéder à l'application :
```
http://localhost:8080
```

## Configuration

### Mode Core (IA)

1. Obtenir une clé API gratuite sur [console.groq.com](https://console.groq.com)
2. Ouvrir les Paramètres dans l'application
3. Sélectionner "Mode Core"
4. Coller la clé API et sauvegarder

## Structure du projet

```
fixaibot/                         # Dépôt Git (racine)
├── index.html                    # Page de redirection
├── README.md                     # Documentation principale
├── DEVELOPER.md                  # Guide développeur
├── LICENSE                       # Licence MIT
├── .gitignore                    # Fichiers ignorés
└── fixo-frontend/
    ├── index.html                # Application principale
    ├── styles/                   # Fichiers CSS
    │   ├── variables.css
    │   ├── base.css
    │   ├── markdown.css
    │   └── help.css
    ├── scripts/                  # Code JavaScript
    │   ├── app.js
    │   ├── components/           # Composants UI
    │   ├── services/             # Logique métier
    │   └── utils/                # Utilitaires
    ├── data/                     # Base de connaissances
    └── assets/                   # Images et ressources
```

## Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **API IA** : Groq (LLaMA 3.1)
- **Icônes** : Lucide Icons
- **Markdown** : Marked.js + Highlight.js

## Déploiement

### GitHub Pages

Le projet est configuré pour un déploiement direct sur GitHub Pages :

1. Pousser le code sur GitHub
2. Activer GitHub Pages dans les paramètres du dépôt
3. L'application sera accessible à : `https://PaSkod-Dev.github.io/FixoBot/`

### Autres plateformes

Compatible avec Netlify, Vercel, et tout hébergeur de fichiers statiques.

## Contribution

Les contributions sont les bienvenues. Consultez [DEVELOPER.md](DEVELOPER.md) pour les détails techniques.

## Licence

Ce projet est sous licence MIT.

## Contact

Pour toute question ou suggestion, ouvrez une issue sur GitHub.

---

Développé pour l'Université de Lomé et les institutions africaines.
