/* 
   FIXƆ - Application principale (Version corrigée avec débogage)
   */

console.log('🔍 [APP] Début du chargement de app.js');

// Fonction globale pour copier le code
window.copierCode = function (bouton, codeId) {
  const codeElement = document.getElementById(codeId);
  if (!codeElement) return;

  // Récupérer le texte brut (sans les balises HTML de coloration)
  const codeTexte = codeElement.textContent || codeElement.innerText;

  // Copier dans le presse-papier
  navigator.clipboard.writeText(codeTexte).then(() => {
    // Feedback visuel
    const spanTexte = bouton.querySelector('span');
    const texteOriginal = spanTexte.textContent;

    bouton.classList.add('copied');
    spanTexte.textContent = 'Copié !';

    // Changer l'icône temporairement
    bouton.querySelector('svg').innerHTML = `
      <polyline points="20 6 9 17 4 12"></polyline>
    `;

    // Restaurer après 2 secondes
    setTimeout(() => {
      bouton.classList.remove('copied');
      spanTexte.textContent = texteOriginal;
      bouton.querySelector('svg').innerHTML = `
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      `;
    }, 2000);
  }).catch(err => {
    console.error('Erreur de copie:', err);
    // Fallback pour les navigateurs plus anciens
    const textarea = document.createElement('textarea');
    textarea.value = codeTexte;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
};

// Fonction pour masquer le loader
function masquerLoader() {
  const loader = document.getElementById('loader-app');
  if (loader) {
    console.log('🔍 [APP] Masquage du loader');
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      if (loader.parentNode) {
        loader.remove();
        console.log('✅ [APP] Loader supprimé');
      }
    }, 300);
  }
}

// Charger les modules de manière séquentielle pour mieux déboguer
(async () => {
  try {
    console.log('🔍 [APP] Chargement des modules...');

    // Charger Chat
    console.log('🔍 [APP] Import Chat...');
    const { Chat } = await import('./components/Chat.js');
    console.log('✅ [APP] Chat importé');

    // Charger storage
    console.log('🔍 [APP] Import storage...');
    const storage = await import('./services/storage.js');
    console.log('✅ [APP] storage importé');

    // Charger constants
    console.log('🔍 [APP] Import constants...');
    const { NOMS_MODES } = await import('./utils/constants.js');
    console.log('✅ [APP] constants importé');

    // Attendre que le DOM soit prêt
    function initialiserApp() {
      console.log('🔍 [APP] Initialisation de l\'application...');

      try {
        // Initialiser le thème
        const theme = storage.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
        console.log('✅ [APP] Thème initialisé:', theme);

        // Initialiser le mode
        const mode = storage.getModeActif();
        const elementMode = document.getElementById('mode-actif');
        if (elementMode) {
          elementMode.textContent = NOMS_MODES[mode] || 'FIXƆ Lite';
        }
        console.log('✅ [APP] Mode initialisé:', mode);

        // Initialiser le chat
        const conteneurMessages = document.getElementById('zone-messages');
        const inputBar = document.getElementById('input-bar');

        if (!conteneurMessages) {
          console.error('❌ [APP] Conteneur de messages introuvable');
          return;
        }

        const chat = new Chat({
          conteneurMessages: conteneurMessages,
          inputBar: inputBar
        });
        console.log('✅ [APP] Chat initialisé');

        // Initialiser les événements
        const btnTheme = document.getElementById('btn-theme');
        if (btnTheme) {
          // Les icônes SVG sont gérées par CSS via data-theme
          // Pas besoin de manipuler les icônes manuellement

          btnTheme.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            console.log('Changement de thème:', currentTheme, '->', newTheme);

            document.documentElement.setAttribute('data-theme', newTheme);
            storage.setTheme(newTheme);

            // Animation de rotation du bouton
            btnTheme.style.transform = 'rotate(360deg)';
            btnTheme.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
              btnTheme.style.transform = '';
            }, 500);
          });
        }

        // Initialiser le composant Settings
        console.log('🔍 [APP] Import Settings...');
        import('./components/Settings.js').then((module) => {
          if (module.Settings) {
            const settings = new module.Settings();
            console.log('✅ [APP] Settings initialisé');
          } else {
            console.error('❌ [APP] Settings class not found in module');
          }
        });

        // Initialiser le composant Help (Centre d'aide)
        console.log('🔍 [APP] Import Help...');
        import('./components/Help.js').then((module) => {
          if (module.Help) {
            const help = new module.Help();
            console.log('✅ [APP] Help initialisé');
          } else {
            console.error('❌ [APP] Help class not found in module');
          }
        }).catch(err => {
          console.error('❌ [APP] Erreur Help:', err);
        });

        console.log('✅ [APP] Événements initialisés');

        // Initialiser les icônes Lucide
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
          // Réinitialiser après un court délai pour s'assurer que toutes les icônes sont créées
          setTimeout(() => {
            lucide.createIcons();
          }, 100);
          console.log('✅ [APP] Icônes Lucide initialisées');
        }

        // Afficher l'heure du message de bienvenue
        const heureBienvenue = document.getElementById('heure-bienvenue');
        if (heureBienvenue) {
          const maintenant = new Date();
          heureBienvenue.textContent = maintenant.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          });
        }

        console.log('✅ [APP] Application initialisée avec succès');

        // Initialiser le comportement de scroll dynamique
        initialiserScrollDynamique();

        // Masquer le loader
        setTimeout(masquerLoader, 100);

      } catch (error) {
        console.error('❌ [APP] Erreur lors de l\'initialisation:', error);
        masquerLoader();
        throw error;
      }
    }

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialiserApp);
    } else {
      // DOM déjà prêt
      initialiserApp();
    }

  } catch (error) {
    console.error('❌ [APP] Erreur fatale:', error);
    console.error('Stack:', error.stack);

    const loader = document.getElementById('loader-app');
    if (loader) {
      loader.innerHTML = `
        <div style="text-align: center; padding: 2rem; max-width: 600px;">
          <h2 style="color: #E74C3C; margin-bottom: 1rem; font-family: Arial, sans-serif;">Erreur de chargement</h2>
          <p style="color: #718096; margin-bottom: 1rem; font-family: Arial, sans-serif;">${error.message}</p>
          <details style="text-align: left; margin: 1rem 0; padding: 1rem; background: #F7F9FC; border-radius: 0.5rem;">
            <summary style="cursor: pointer; color: #2D3748;">Détails techniques</summary>
            <pre style="margin-top: 0.5rem; font-size: 0.8rem; color: #718096; overflow: auto;">${error.stack || 'Pas de stack trace'}</pre>
          </details>
          <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: #1a365d; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; margin: 0.5rem;">Recharger</button>
        </div>
      `;
    }
  }
})();

/* ───────────────────────────────────────────────────────────────────────────
   FONCTION POUR SCROLL DYNAMIQUE DE L'EN-TÊTE
   ─────────────────────────────────────────────────────────────────────────── */

function initialiserScrollDynamique() {
  const header = document.querySelector('.chat-container__header');
  const zoneMessages = document.getElementById('zone-messages');

  if (!header || !zoneMessages) {
    console.warn('⚠️ [SCROLL] Éléments introuvables pour le scroll dynamique');
    return;
  }

  let dernierScroll = 0;
  let scrollTimeout = null;
  let headerVisible = true;

  zoneMessages.addEventListener('scroll', () => {
    const scrollActuel = zoneMessages.scrollTop;

    // Détecter la direction du scroll
    if (scrollActuel > dernierScroll && scrollActuel > 100) {
      // Scroll vers le bas - cacher l'en-tête
      if (headerVisible) {
        header.classList.remove('header-visible');
        header.classList.add('header-hidden');
        headerVisible = false;
      }
    } else if (scrollActuel < dernierScroll) {
      // Scroll vers le haut - afficher l'en-tête
      if (!headerVisible) {
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
        headerVisible = true;
      }
    }

    dernierScroll = scrollActuel;

    // Réinitialiser le timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Après 1 seconde sans scroll, toujours afficher l'en-tête
      if (!headerVisible) {
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
        headerVisible = true;
      }
    }, 1000);
  });

  console.log('✅ [SCROLL] Comportement de scroll dynamique initialisé');
}

