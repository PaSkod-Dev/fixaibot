/* 
   Composant : Message
   Description : Représente une bulle de message dans le chat FIXƆ
   
   Ce composant gère :
   - L'affichage des messages utilisateur (alignés à droite)
   - L'affichage des messages assistant (alignés à gauche avec avatar)
   - Le rendu Markdown pour les réponses de l'assistant
   - L'affichage des étapes de solution numérotées
   - Les indicateurs de statut (envoyé, reçu, erreur)
   
   Utilisation :
   const message = new Message({
     contenu: "Bonjour !",
     type: "utilisateur",
     horodatage: new Date()
   });
   message.ajouterAuConteneur(document.getElementById('zone-messages'));
   
   Auteur : Équipe FIXƆ
   */

// 
// IMPORTS
// On importe les fonctions utilitaires et les constantes nécessaires
// 

import { formaterHeure, echapperHtml } from '../utils/helpers.js';
import { TYPES_MESSAGE, STATUTS_MESSAGE } from '../utils/constants.js';
import { parseMarkdown } from '../utils/markdown.js';

/**
 * Classe Message - Représente un message dans la conversation
 * 
 * Chaque message peut être de type "utilisateur" ou "assistant".
 * Les messages assistant peuvent contenir des étapes de solution
 * et sont rendus avec le support Markdown.
 */
export class Message {
  /**
   * @param {Object} options - Options du message
   * @param {string} options.contenu - Texte du message
   * @param {string} options.type - 'utilisateur' ou 'assistant'
   * @param {Date} options.horodatage - Date/heure du message
   * @param {string} options.statut - 'envoye', 'recu' ou 'erreur' (pour utilisateur)
   * @param {Array} options.etapes - Liste d'étapes pour une solution (optionnel)
   */
  constructor(options = {}) {
    this.contenu = options.contenu || '';
    this.type = options.type || TYPES_MESSAGE.ASSISTANT;
    this.horodatage = options.horodatage || new Date();
    this.statut = options.statut || STATUTS_MESSAGE.ENVOYE;
    this.etapes = options.etapes || null;
    this.id = options.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formate l'heure du message
   * @returns {string} Heure formatée (HH:MM)
   */
  formaterHeure() {
    return formaterHeure(this.horodatage);
  }

  /**
   * Génère le HTML des étapes (si présentes)
   * @returns {string} HTML des étapes
   */
  genererEtapes() {
    if (!this.etapes || this.etapes.length === 0) {
      return '';
    }

    let html = '<div class="message__etapes">';

    this.etapes.forEach((etape, index) => {
      // Échapper le HTML pour éviter les injections XSS
      const etapeEchappee = echapperHtml(etape);
      html += `
        <div class="message__etape">
          <span class="message__etape-numero">${index + 1}</span>
          <span class="message__etape-texte">${etapeEchappee}</span>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Génère le HTML du message
   * @returns {HTMLElement} Élément DOM du message
   */
  creer() {
    const element = document.createElement('div');
    element.className = `message message--${this.type}`;
    element.id = this.id;
    element.setAttribute('role', 'listitem');

    // Avatar pour l'assistant (SVG intégré)
    const avatar = this.type === TYPES_MESSAGE.ASSISTANT
      ? `<div class="message__avatar" aria-label="Avatar FIXƆ">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 8V4H8"/>
             <rect width="16" height="12" x="4" y="8" rx="2"/>
             <path d="M2 14h2"/>
             <path d="M20 14h2"/>
             <path d="M15 13v2"/>
             <path d="M9 13v2"/>
           </svg>
         </div>`
      : '';

    // Indicateur de statut pour l'utilisateur
    const indicateurStatut = this.type === TYPES_MESSAGE.UTILISATEUR
      ? `<span class="message__statut message__statut--${this.statut}" aria-label="Statut: ${this.statut}"></span>`
      : '';

    // Traitement du contenu selon le type de message
    let contenuHtml;
    if (this.type === TYPES_MESSAGE.ASSISTANT) {
      // Pour l'assistant: utiliser le parseur Markdown complet
      contenuHtml = parseMarkdown(this.contenu);
    } else {
      // Pour l'utilisateur: juste échapper le HTML et convertir les retours à la ligne
      contenuHtml = echapperHtml(this.contenu);
      contenuHtml = contenuHtml.replace(/\n/g, '<br>');
    }

    element.innerHTML = `
      ${avatar}
      <div class="message__contenu">
        <div class="message__bulle">
          <div class="message__texte">${contenuHtml}</div>
          ${this.genererEtapes()}
        </div>
        <div class="message__meta">
          <span class="message__heure">${this.formaterHeure()}</span>
          ${indicateurStatut}
        </div>
      </div>
    `;

    return element;
  }

  /**
   * Ajoute le message au conteneur
   * @param {HTMLElement} conteneur - Conteneur où ajouter le message
   * @param {boolean} defiler - Si true, fait défiler vers le message (géré par Chat.js maintenant)
   */
  ajouterAuConteneur(conteneur, defiler = false) {
    if (!conteneur) return null;

    const element = this.creer();
    conteneur.appendChild(element);
    return element;
  }

  /**
   * Met à jour le statut du message (pour les messages utilisateur)
   * @param {string} nouveauStatut - Nouveau statut
   */
  mettreAJourStatut(nouveauStatut) {
    this.statut = nouveauStatut;
    const element = document.getElementById(this.id);
    if (element) {
      const statutElement = element.querySelector('.message__statut');
      if (statutElement) {
        statutElement.className = `message__statut message__statut--${nouveauStatut}`;
      }
    }
  }
}

