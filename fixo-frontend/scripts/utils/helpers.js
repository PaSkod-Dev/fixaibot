/* 
   FIXƆ - Fonctions utilitaires
   */

/**
 * Normalise un texte (minuscules, suppression accents, ponctuation)
 * @param {string} texte - Texte à normaliser
 * @returns {string} Texte normalisé
 */
export function normaliserTexte(texte) {
  if (!texte || typeof texte !== 'string') return '';

  // Convertir en minuscules
  texte = texte.toLowerCase();

  // Remplacer les accents
  const accents = {
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'à': 'a', 'â': 'a', 'ä': 'a',
    'ù': 'u', 'û': 'u', 'ü': 'u',
    'î': 'i', 'ï': 'i',
    'ô': 'o', 'ö': 'o',
    'ç': 'c'
  };

  for (const [accent, remplacement] of Object.entries(accents)) {
    texte = texte.replace(new RegExp(accent, 'g'), remplacement);
  }

  // Supprimer la ponctuation et garder seulement lettres, chiffres et espaces
  texte = texte.replace(/[^\w\s]/g, ' ');

  // Supprimer les espaces multiples
  texte = texte.replace(/\s+/g, ' ').trim();

  return texte;
}

/**
 * Formate une date en heure (HH:MM)
 * @param {Date} date - Date à formater
 * @returns {string} Heure formatée
 */
export function formaterHeure(date) {
  if (!(date instanceof Date)) {
    date = new Date();
  }

  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formate une date complète
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
export function formaterDate(date) {
  if (!(date instanceof Date)) {
    date = new Date();
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Débounce une fonction
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en millisecondes
 * @returns {Function} Fonction débouncée
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Vérifie si un élément est visible dans le viewport
 * @param {HTMLElement} element - Élément à vérifier
 * @returns {boolean} True si visible
 */
export function estVisible(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Fait défiler un élément en douceur
 * @param {HTMLElement} element - Élément vers lequel défiler
 * @param {Object} options - Options de défilement
 */
export function defilerVers(element, options = {}) {
  if (!element) return;

  const {
    behavior = 'smooth',
    block = 'nearest',
    inline = 'nearest'
  } = options;

  element.scrollIntoView({ behavior, block, inline });
}

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export function genererId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param {string} texte - Texte à échapper
 * @returns {string} Texte échappé
 */
export function echapperHtml(texte) {
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
}

