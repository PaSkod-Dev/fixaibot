# Guide de démarrage rapide - FIXƆ

## Option 1 : Node.js (Recommandé - Fonctionne !)

Vous avez Node.js installé. Utilisez cette commande :

```powershell
npx http-server -p 8080 -o
```

Le flag `-o` ouvre automatiquement votre navigateur.

## Option 2 : Script PowerShell automatique

Double-cliquez sur `start-server.ps1` ou exécutez :

```powershell
.\start-server.ps1
```

Ce script détecte automatiquement le meilleur serveur disponible.

## Option 3 : Ouvrir directement dans le navigateur

Si vous n'avez besoin que de tester rapidement, vous pouvez ouvrir `index.html` directement dans votre navigateur.

⚠️ **Note** : Certaines fonctionnalités (comme le chargement de `problemes.json`) nécessitent un serveur web à cause des restrictions CORS.

## Option 4 : Corriger Python (si vous préférez Python)

Le problème avec Python 3.13 semble être une installation corrompue. Solutions :

1. **Réinstaller Python** depuis [python.org](https://www.python.org/downloads/)
2. **Utiliser Python 3.11 ou 3.12** (plus stable)
3. **Réparer l'installation** : Ouvrez "Paramètres" > "Applications" > Python > "Modifier" > "Réparer"

## Accès

Une fois le serveur démarré, ouvrez votre navigateur à :

**http://localhost:8080**

---

**Astuce** : Pour arrêter le serveur, appuyez sur `Ctrl+C` dans le terminal.