# FIXƆ - Assistant de Dépannage Informatique

**FIXƆ** (prononcé "fix-oh") est un assistant intelligent de support technique accessible 24h/24, conçu pour les universités africaines, commençant par l'Université de Lomé.

## Démarrage rapide

### Prérequis

- Un serveur web local (Python, Node.js, ou autre)
- Un navigateur moderne (Chrome, Firefox, Edge, Safari)

### Installation

1. Clonez ou téléchargez ce projet
2. Ouvrez un terminal dans le dossier `fixo-frontend`
3. Lancez un serveur web local :

**Avec Python 3 :**
```bash
python -m http.server 8080
```

**Avec Node.js (http-server) :**
```bash
npx http-server -p 8080
```

4. Ouvrez votre navigateur à l'adresse : `http://localhost:8080`

## 📁 Structure du projet

```
fixo-frontend/
├── index.html              # Page principale
├── assets/                 # Ressources (images, fonts)
├── styles/                 # Fichiers CSS
│   ├── variables.css       # Variables du design system
│   ├── base.css            # Styles de base
│   ├── layout.css          # Grilles et disposition
│   ├── components.css      # Styles des composants
│   ├── animations.css      # Animations
│   ├── responsive.css      # Media queries
│   └── themes/            # Thèmes (clair/sombre)
├── scripts/               # JavaScript
│   ├── app.js            # Point d'entrée principal
│   ├── components/       # Composants réutilisables
│   ├── services/         # Services (API, storage, mode-lite)
│   └── utils/            # Fonctions utilitaires
└── data/                 # Données
    └── problemes.json    # Base de connaissances (39 problèmes)
```

## Fonctionnalités

### Mode Lite (Implémenté)
- **Fonctionnement hors-ligne** : Aucune connexion internet requise
- **39 problèmes couverts** : Réseau, système, matériel, logiciels, plateforme
- **Recherche intelligente** : Matching par mots-clés et catégories
- **Solutions étape par étape** : Instructions détaillées pour chaque problème

### Interface
- **Design moderne et premium** : Touches dorées, animations fluides
- **Mode sombre/clair** : Basculement en un clic
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Accessible** : Respect des standards WCAG 2.1

## Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design system avec variables CSS
- **JavaScript ES6+** : Modules, classes, async/await
- **Lucide Icons** : Icônes SVG modernes

## Utilisation

1. **Décrire votre problème** : Tapez votre problème dans la zone de saisie
2. **Recevoir la solution** : FIXƆ identifie le problème et propose une solution
3. **Suivre les étapes** : Les solutions sont présentées étape par étape

### Exemples de questions

- "Mon Wi-Fi ne fonctionne pas"
- "Mon PC est très lent"
- "Je ne peux pas me connecter au site de l'université"
- "Mon imprimante n'imprime pas"
- "Comment accéder au BIOS ?"

##  Modes de FIXƆ

### Mode Lite (Actuel)
- Règles et arbre de décision
- Fonctionne hors-ligne
- 39 problèmes prédéfinis

### Mode Core (À venir)
- Modèle IA Hugging Face
- Compréhension contextuelle avancée

### Mode Pro (À venir)
- API externe (Claude, GPT, Gemini)
- Pour les cas complexes

## 🛠️ Développement

### Structure du code

- **Composants** : Classes réutilisables (Message, InputBar, Chat)
- **Services** : Logique métier (mode-lite, storage)
- **Utils** : Fonctions utilitaires (helpers, constants)

### Ajouter un nouveau problème

Éditez `data/problemes.json` et ajoutez un objet dans le tableau `problemes` :

```json
{
  "code": "NOUV-001",
  "categorie": "systeme",
  "titre": "Titre du problème",
  "motsClés": ["mot1", "mot2", "mot3"],
  "solution": {
    "resume": "Résumé de la solution",
    "etapes": ["Étape 1", "Étape 2", "Étape 3"]
  }
}
```

## 📄 Licence

Voir le fichier LICENSE dans le dossier parent.

## 👥 Équipe

Université de Lomé - Décembre 2025
Équipe FIXƆ

---

**FIXƆ** - "Fix" + "ɔ" (Éwé) - Innovation africaine 🤖