/* 
   Composant : InputBar
   Description : Barre de saisie pour les messages
   */

/**
 * Classe InputBar - Gère la barre de saisie des messages
 */
export class InputBar {
  /**
   * @param {Object} options - Options de la barre de saisie
   * @param {HTMLElement} options.conteneur - Conteneur DOM
   * @param {Function} options.onEnvoyer - Callback appelé lors de l'envoi
   */
  constructor(options = {}) {
    this.conteneur = options.conteneur || document.getElementById('input-bar');
    this.onEnvoyer = options.onEnvoyer || null;
    this.champMessage = null;
    this.boutonEnvoyer = null;

    this.initialiser();
  }

  /**
   * Initialise la barre de saisie
   */
  initialiser() {
    if (!this.conteneur) return;

    // Récupérer les éléments
    this.champMessage = this.conteneur.querySelector('#champ-message') ||
      this.conteneur.querySelector('.input-bar__champ');
    this.boutonEnvoyer = this.conteneur.querySelector('#btn-envoyer') ||
      this.conteneur.querySelector('.input-bar__bouton');

    if (!this.champMessage || !this.boutonEnvoyer) {
      console.error('Éléments de la barre de saisie introuvables');
      return;
    }

    // Événements
    this.ajouterEvenements();

    // Ajuster la hauteur automatiquement
    this.ajusterHauteur();
  }

  /**
   * Ajoute les événements
   */
  ajouterEvenements() {
    // Envoi avec le bouton
    this.boutonEnvoyer.addEventListener('click', () => {
      this.envoyer();
    });

    // Envoi avec Entrée (Shift+Entrée pour nouvelle ligne)
    this.champMessage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.envoyer();
      }
    });

    // Ajuster la hauteur lors de la saisie
    this.champMessage.addEventListener('input', () => {
      this.ajusterHauteur();
      this.mettreAJourBouton();
    });

    // Focus initial
    this.champMessage.addEventListener('focus', () => {
      this.conteneur.classList.add('input-bar--focus');
    });

    this.champMessage.addEventListener('blur', () => {
      this.conteneur.classList.remove('input-bar--focus');
    });
  }

  /**
   * Ajuste la hauteur du champ de texte automatiquement
   */
  ajusterHauteur() {
    if (!this.champMessage) return;

    // Réinitialiser la hauteur pour obtenir la hauteur réelle
    this.champMessage.style.height = 'auto';

    // Définir la nouvelle hauteur
    const hauteurMax = 120; // px
    const hauteur = Math.min(this.champMessage.scrollHeight, hauteurMax);
    this.champMessage.style.height = `${hauteur}px`;
    this.champMessage.style.overflowY = this.champMessage.scrollHeight > hauteurMax ? 'auto' : 'hidden';
  }

  /**
   * Met à jour l'état du bouton d'envoi
   */
  mettreAJourBouton() {
    if (!this.boutonEnvoyer || !this.champMessage) return;

    const texte = this.champMessage.value.trim();
    const estVide = texte.length === 0;

    this.boutonEnvoyer.disabled = estVide;

    if (estVide) {
      this.boutonEnvoyer.style.opacity = '0.6';
      this.boutonEnvoyer.style.cursor = 'not-allowed';
    } else {
      this.boutonEnvoyer.style.opacity = '1';
      this.boutonEnvoyer.style.cursor = 'pointer';
    }
  }

  /**
   * Envoie le message
   */
  envoyer() {
    if (!this.champMessage) return;

    const texte = this.champMessage.value.trim();

    if (texte.length === 0) {
      return;
    }

    // Appeler le callback
    if (this.onEnvoyer) {
      this.onEnvoyer(texte);
    }

    // Vider le champ
    this.champMessage.value = '';
    this.ajusterHauteur();
    this.mettreAJourBouton();

    // Remettre le focus
    this.champMessage.focus();
  }

  /**
   * Vide le champ de saisie
   */
  vider() {
    if (this.champMessage) {
      this.champMessage.value = '';
      this.ajusterHauteur();
      this.mettreAJourBouton();
    }
  }

  /**
   * Désactive la barre de saisie
   */
  desactiver() {
    if (this.champMessage) {
      this.champMessage.disabled = true;
    }
    if (this.boutonEnvoyer) {
      this.boutonEnvoyer.disabled = true;
    }
  }

  /**
   * Active la barre de saisie
   */
  activer() {
    if (this.champMessage) {
      this.champMessage.disabled = false;
    }
    this.mettreAJourBouton();
  }

  /**
   * Met le focus sur le champ de saisie
   */
  focus() {
    if (this.champMessage) {
      this.champMessage.focus();
    }
  }

  /**
   * Récupère le texte actuel
   * @returns {string} Texte dans le champ
   */
  getTexte() {
    return this.champMessage ? this.champMessage.value.trim() : '';
  }
}

