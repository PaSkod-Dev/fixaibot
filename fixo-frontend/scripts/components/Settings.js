/* 
   Composant : Settings (Paramètres)
   Description : Gère le modal de paramètres de l'application FIXƆ
   
   Ce composant permet à l'utilisateur de :
   - Changer le mode d'assistance (Lite, Core, Pro)
   - Changer le thème (Clair, Sombre, Auto)
   - Effacer l'historique des conversations
   
   Le modal s'ouvre en cliquant sur le bouton ⚙️ dans le header.
   Les préférences sont sauvegardées dans le localStorage.
   
   Structure HTML requise :
   - #modal-parametres : L'overlay du modal
   - #btn-parametres : Bouton pour ouvrir le modal
   - #btn-fermer-modal : Bouton pour fermer le modal
   - #options-theme : Conteneur des boutons de thème
   - #options-mode : Conteneur des options de mode
   - #btn-effacer-historique : Bouton pour effacer l'historique
   - #modal-confirmation : Modal de confirmation pour les actions destructives
   
   Auteur : Équipe FIXƆ
   */

// 
// IMPORTS
// 

import { sauvegarderTheme, recupererTheme, sauvegarderMode, recupererMode } from '../services/storage.js';
import modeCore from '../services/mode-core.js';

/**
 * Classe Settings - Contrôleur du modal de paramètres
 * 
 * Cette classe gère toute la logique du modal de paramètres :
 * ouverture/fermeture, changement de thème, changement de mode,
 * et effacement de l'historique avec confirmation.
 */
export class Settings {
    constructor() {
        this.modal = document.getElementById('modal-parametres');
        this.btnOuvrir = document.getElementById('btn-parametres');
        this.btnFermer = document.getElementById('btn-fermer-modal');
        this.optionsTheme = document.getElementById('options-theme');
        this.optionsMode = document.getElementById('options-mode');
        this.btnEffacerHistorique = document.getElementById('btn-effacer-historique');

        // Éléments pour la configuration API
        this.selectApi = document.getElementById('select-api');
        this.inputApiKey = document.getElementById('input-api-key');
        this.btnSauvegarderApi = document.getElementById('btn-sauvegarder-api');

        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.modal) {
            console.warn('Modal paramètres non trouvé');
            return;
        }

        this.btnOuvrir?.addEventListener('click', () => this.ouvrir());
        this.btnFermer?.addEventListener('click', () => this.fermer());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.fermer();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.fermer();
        });

        this.optionsTheme?.querySelectorAll('.parametre-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.changerTheme(btn.dataset.theme));
        });

        this.optionsMode?.querySelectorAll('input[name="mode"]').forEach(input => {
            input.addEventListener('change', () => this.changerMode(input.value));
        });

        this.btnEffacerHistorique?.addEventListener('click', () => this.effacerHistorique());

        // Événements pour la configuration API
        this.btnSauvegarderApi?.addEventListener('click', () => this.sauvegarderApiKey());

        this.synchroniserEtat();
    }

    synchroniserEtat() {
        const themeActuel = recupererTheme() || 'dark';
        this.mettreAJourBoutonsTheme(themeActuel);
        const modeActuel = recupererMode() || 'lite';
        this.mettreAJourOptionsMode(modeActuel);
    }

    ouvrir() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.isOpen = true;
        this.btnFermer?.focus();
        document.body.style.overflow = 'hidden';
        this.synchroniserEtat();
    }

    fermer() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
        document.body.style.overflow = '';
        this.btnOuvrir?.focus();
    }

    changerTheme(theme) {
        let themeEffectif = theme;
        if (theme === 'auto') {
            themeEffectif = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', themeEffectif);
        sauvegarderTheme(theme);
        this.mettreAJourBoutonsTheme(theme);
        this.mettreAJourIconeThemeHeader(themeEffectif);
    }

    mettreAJourBoutonsTheme(theme) {
        this.optionsTheme?.querySelectorAll('.parametre-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    mettreAJourIconeThemeHeader(theme) {
        const btnTheme = document.getElementById('btn-theme');
        if (!btnTheme) return;
        const iconSun = btnTheme.querySelector('.icon-sun');
        const iconMoon = btnTheme.querySelector('.icon-moon');
        if (theme === 'dark') {
            if (iconSun) iconSun.style.display = 'block';
            if (iconMoon) iconMoon.style.display = 'none';
        } else {
            if (iconSun) iconSun.style.display = 'none';
            if (iconMoon) iconMoon.style.display = 'block';
        }
    }

    changerMode(mode) {
        // Mode Pro pas encore disponible
        if (mode === 'pro') {
            this.afficherNotification('FIXƆ Pro sera bientôt disponible !', 'info');
            this.mettreAJourOptionsMode('lite');
            return;
        }

        // Mode Core nécessite une clé API
        if (mode === 'core' && !modeCore.estConfigure()) {
            this.afficherNotification('Configurez d\'abord une clé API pour utiliser le Mode Core', 'info');
        }

        sauvegarderMode(mode);
        const indicateurMode = document.getElementById('mode-actif');
        if (indicateurMode) {
            const noms = { lite: 'FIXƆ Lite', core: 'FIXƆ Core', pro: 'FIXƆ Pro' };
            indicateurMode.textContent = noms[mode] || 'FIXƆ Lite';
        }
    }

    /**
     * Sauvegarde la clé API pour le mode Core
     */
    sauvegarderApiKey() {
        const api = this.selectApi?.value || 'groq';
        const cleApi = this.inputApiKey?.value?.trim();

        if (!cleApi) {
            this.afficherNotification('Veuillez entrer une clé API', 'error');
            return;
        }

        // Configurer l'API dans modeCore
        modeCore.configurerApi(cleApi, api);

        // Vider le champ pour la sécurité
        if (this.inputApiKey) {
            this.inputApiKey.value = '';
            this.inputApiKey.placeholder = '✓ Clé API configurée';
        }

        this.afficherNotification('Clé API sauvegardée ! Mode Core activé.', 'success');
    }

    mettreAJourOptionsMode(mode) {
        const input = this.optionsMode?.querySelector('input[value="' + mode + '"]');
        if (input) input.checked = true;
    }

    effacerHistorique() {
        this.afficherConfirmation({
            titre: 'Confirmer la suppression',
            message: 'Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.',
            onConfirm: () => {
                // Effacer les données du localStorage
                localStorage.removeItem('fixo_historique');
                localStorage.removeItem('fixo_conversations');

                // Vider visuellement la zone de messages (garder le message de bienvenue)
                const zoneMessages = document.getElementById('zone-messages');
                if (zoneMessages) {
                    const messageBienvenue = zoneMessages.querySelector('.message-bienvenue');
                    zoneMessages.innerHTML = '';
                    if (messageBienvenue) {
                        zoneMessages.appendChild(messageBienvenue);
                    }
                }

                // Afficher notification de succès
                this.afficherNotification('Historique effacé avec succès', 'success');

                // Fermer le modal de paramètres
                this.fermer();
            }
        });
    }

    afficherConfirmation(options) {
        const modal = document.getElementById('modal-confirmation');
        const titre = document.getElementById('confirm-titre');
        const message = document.getElementById('confirm-message');
        const btnAnnuler = document.getElementById('confirm-annuler');
        const btnOk = document.getElementById('confirm-ok');

        if (!modal) {
            if (confirm(options.message)) {
                if (options.onConfirm) options.onConfirm();
            }
            return;
        }

        if (titre) titre.textContent = options.titre || 'Confirmation';
        if (message) message.textContent = options.message || 'Êtes-vous sûr ?';

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        function fermerConfirmation() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            btnAnnuler.removeEventListener('click', onAnnuler);
            btnOk.removeEventListener('click', onConfirm);
            modal.removeEventListener('click', onOverlayClick);
        }

        function onAnnuler() {
            fermerConfirmation();
            if (options.onCancel) options.onCancel();
        }

        function onConfirm() {
            fermerConfirmation();
            if (options.onConfirm) options.onConfirm();
        }

        function onOverlayClick(e) {
            if (e.target === modal) {
                fermerConfirmation();
                if (options.onCancel) options.onCancel();
            }
        }

        btnAnnuler.addEventListener('click', onAnnuler);
        btnOk.addEventListener('click', onConfirm);
        modal.addEventListener('click', onOverlayClick);
        btnAnnuler.focus();
    }

    afficherNotification(msg, type) {
        const notification = document.createElement('div');
        notification.textContent = msg;
        let bgColor = '#f59e0b';
        if (type === 'success') bgColor = '#10b981';
        if (type === 'error') bgColor = '#ef4444';
        notification.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:' + bgColor + ';color:white;border-radius:12px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:10000;';
        document.body.appendChild(notification);
        setTimeout(function () {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(function () { notification.remove(); }, 300);
        }, 3000);
    }
}