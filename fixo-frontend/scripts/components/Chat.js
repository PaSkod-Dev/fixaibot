/* 
   Composant : Chat
   Description : Gestionnaire principal du chat FIXƆ
   
   Ce composant gère :
   - L'envoi et la réception des messages
   - La persistance des conversations (sauvegarde/restauration)
   - Le scroll automatique vers les nouveaux messages
   - L'intégration avec les différents modes (Lite, Core, Pro)
   
   Auteur : Équipe FIXƆ
   */

import { Message } from './Message.js';
import { InputBar } from './InputBar.js';
import { TYPES_MESSAGE, STATUTS_MESSAGE } from '../utils/constants.js';
import { getHistorique, setHistorique, getModeActif } from '../services/storage.js';
import modeLite from '../services/mode-lite.js';
import modeCore from '../services/mode-core.js';
import { parseMarkdown } from '../utils/markdown.js';

/**
 * Classe Chat - Contrôleur principal de la conversation
 * 
 * Cette classe est le cœur de l'application FIXƆ. Elle coordonne :
 * - La saisie utilisateur via InputBar
 * - L'affichage des messages via Message
 * - Le traitement des requêtes via les modes (Lite, Core, Pro)
 * - La persistance des données via storage.js
 */
export class Chat {
  /**
   * Crée une nouvelle instance du Chat
   * 
   * @param {Object} options - Configuration du chat
   * @param {HTMLElement} options.conteneurMessages - Zone où afficher les messages
   * @param {HTMLElement} options.inputBar - Barre de saisie des messages
   * 
   * @example
   * const chat = new Chat({
   *   conteneurMessages: document.getElementById('zone-messages'),
   *   inputBar: document.getElementById('input-bar')
   * });
   */
  constructor(options = {}) {
    // 
    // PROPRIÉTÉS PRINCIPALES
    // 

    /** @type {HTMLElement} Zone d'affichage des messages */
    this.conteneurMessages = options.conteneurMessages ||
      document.getElementById('zone-messages');

    /** @type {InputBar|null} Composant de saisie */
    this.inputBar = null;

    /** @type {Array} Liste des messages de la conversation */
    this.messages = [];

    /** @type {boolean} Indique si un message est en cours de traitement */
    this.enCours = false;

    /** @type {HTMLElement|null} Bouton pour scroller vers le bas */
    this.scrollToBottomBtn = null;

    // 
    // INITIALISATION
    // 

    // Créer la barre de saisie si un conteneur est fourni
    if (options.inputBar) {
      this.inputBar = new InputBar({
        conteneur: options.inputBar,
        onEnvoyer: (texte) => this.envoyerMessage(texte)
      });
    }

    // Configurer le système de scroll automatique
    this.initScrollSystem();

    // Restaurer l'historique des conversations précédentes
    this.restaurerHistorique();
  }

  /**
   * Initialise le système de scroll automatique
   */
  initScrollSystem() {
    if (!this.conteneurMessages) return;

    // Récupérer le bouton scroll-to-bottom
    this.scrollToBottomBtn = document.getElementById('btn-scroll-bottom');

    // Détecter le scroll pour afficher/masquer le bouton
    this.conteneurMessages.addEventListener('scroll', () => {
      this.updateScrollToBottomButton();
    }, { passive: true });

    // Gérer le clic sur le bouton scroll-to-bottom
    if (this.scrollToBottomBtn) {
      this.scrollToBottomBtn.addEventListener('click', () => {
        this.scrollToLatestMessage();
        this.scrollToBottomBtn.classList.remove('visible');
      });
    }
  }

  /**
   * Met à jour la visibilité du bouton scroll-to-bottom
   */
  updateScrollToBottomButton() {
    if (!this.scrollToBottomBtn) return;

    if (this.isNearBottom(200)) {
      this.scrollToBottomBtn.classList.remove('visible');
    } else {
      this.scrollToBottomBtn.classList.add('visible');
    }
  }

  /**
   * Envoie un message utilisateur et attend la réponse
   * @param {string} texte - Texte du message
   */
  async envoyerMessage(texte) {
    if (!texte || texte.trim().length === 0) return;
    if (this.enCours) return;

    // Créer et afficher le message utilisateur
    const messageUtilisateur = new Message({
      contenu: texte,
      type: TYPES_MESSAGE.UTILISATEUR,
      horodatage: new Date(),
      statut: STATUTS_MESSAGE.ENVOYE
    });

    this.ajouterMessage(messageUtilisateur);
    this.messages.push(messageUtilisateur);

    // Scroll vers le bas pour voir le message envoyé
    this.scrollToLatestMessage();

    // Désactiver la barre de saisie
    if (this.inputBar) {
      this.inputBar.desactiver();
    }

    // Mettre à jour le statut du message
    messageUtilisateur.mettreAJourStatut(STATUTS_MESSAGE.RECU);

    // Traiter le message et obtenir la réponse
    this.enCours = true;

    // Afficher l'indicateur de réflexion
    const indicateurReflexion = this.afficherIndicateurReflexion();

    try {
      // Déterminer le mode actif et traiter le message
      const modeActif = getModeActif();
      let reponse;

      if (modeActif === 'core' && modeCore.estConfigure()) {
        // Mode Core : utiliser l'IA
        console.log('🤖 Traitement avec Mode Core (IA)');
        reponse = await modeCore.traiterMessage(texte);
      } else {
        // Mode Lite : utiliser la base de connaissances locale
        console.log('📚 Traitement avec Mode Lite (local)');
        reponse = await modeLite.traiterMessage(texte);
      }

      // Retirer l'indicateur de réflexion
      this.retirerIndicateurReflexion(indicateurReflexion);

      // Créer le message de l'assistant (vide au départ pour l'effet typing)
      const messageAssistant = new Message({
        contenu: '',
        type: TYPES_MESSAGE.ASSISTANT,
        horodatage: new Date(),
        etapes: reponse.etapes || null
      });

      this.ajouterMessage(messageAssistant);
      this.messages.push(messageAssistant);

      // Effet de typing progressif
      await this.afficherAvecEffetTyping(messageAssistant, reponse.contenu);

      // Sauvegarder l'historique après chaque échange complet
      this.sauvegarderHistorique();

      // Scroll automatique vers la réponse de l'IA
      this.scrollToLatestMessage();

    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);

      // Retirer l'indicateur de réflexion en cas d'erreur
      this.retirerIndicateurReflexion(indicateurReflexion);

      // Message d'erreur
      const messageErreur = new Message({
        contenu: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        type: TYPES_MESSAGE.ASSISTANT,
        horodatage: new Date()
      });

      this.ajouterMessage(messageErreur);
      this.messages.push(messageErreur);
    } finally {
      this.enCours = false;

      // Réactiver la barre de saisie
      if (this.inputBar) {
        this.inputBar.activer();
        this.inputBar.focus();
      }
    }
  }

  /**
   * Ajoute un message au conteneur
   * @param {Message} message - Message à ajouter
   * @returns {HTMLElement|null} L'élément du message créé
   */
  ajouterMessage(message) {
    if (!this.conteneurMessages) return null;

    const element = message.ajouterAuConteneur(this.conteneurMessages, false);

    // Retourner l'élément pour permettre le scroll personnalisé dans envoyerMessage
    return element;
  }

  /**
   * Vide l'historique des messages
   */
  vider() {
    if (this.conteneurMessages) {
      // Garder seulement le message de bienvenue
      const messageBienvenue = this.conteneurMessages.querySelector('#message-bienvenue');
      this.conteneurMessages.innerHTML = '';
      if (messageBienvenue) {
        this.conteneurMessages.appendChild(messageBienvenue);
      }
    }
    this.messages = [];
  }

  /**
   * Fait défiler vers le bas avec animation fluide
   */
  defilerVersBas() {
    if (this.conteneurMessages) {
      this.smoothScrollToBottom();
    }
  }

  /**
   * Scroll fluide vers le bas du conteneur - SIMPLE ET EFFICACE
   */
  smoothScrollToBottom() {
    if (!this.conteneurMessages) return;

    // Scroll direct vers le bas
    this.conteneurMessages.scrollTo({
      top: this.conteneurMessages.scrollHeight,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll vers le dernier message (le plus récent) - MÉTHODE PRINCIPALE
   * C'est cette méthode qui fait tout le travail
   */
  scrollToLatestMessage() {
    if (!this.conteneurMessages) return;

    // Attendre que le DOM soit complètement rendu
    requestAnimationFrame(() => {
      // Petit délai pour s'assurer que le contenu est rendu
      setTimeout(() => {
        // Scroll vers le bas du conteneur
        this.conteneurMessages.scrollTo({
          top: this.conteneurMessages.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);

      // Deuxième tentative après 300ms (pour les contenus dynamiques comme les étapes)
      setTimeout(() => {
        this.conteneurMessages.scrollTo({
          top: this.conteneurMessages.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    });
  }

  /**
   * Vérifie si le scroll est proche du bas
   * @param {number} threshold - Distance en pixels du bas
   * @returns {boolean}
   */
  isNearBottom(threshold = 100) {
    if (!this.conteneurMessages) return true;

    const { scrollTop, scrollHeight, clientHeight } = this.conteneurMessages;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }

  /**
   * Force le scroll vers le bas (utile après chargement initial)
   */
  forceScrollToBottom() {
    if (!this.conteneurMessages) return;
    this.conteneurMessages.scrollTop = this.conteneurMessages.scrollHeight;
  }

  // 
  // EFFET TYPING ET INDICATEUR DE RÉFLEXION
  // Ces méthodes créent une expérience utilisateur fluide
  //

  /**
   * Affiche l'indicateur de réflexion (FIXƆ est en train de réfléchir...)
   * @returns {HTMLElement} L'élément indicateur créé
   */
  afficherIndicateurReflexion() {
    const indicateur = document.createElement('div');
    indicateur.className = 'message message--assistant indicateur-reflexion';
    indicateur.innerHTML = `
      <div class="message__avatar">
        <span class="avatar-emoji">🤖</span>
      </div>
      <div class="message__bulle">
        <div class="reflexion-contenu">
          <span class="reflexion-texte">FIXƆ réfléchit</span>
          <span class="reflexion-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </div>
      </div>
    `;

    this.conteneurMessages.appendChild(indicateur);
    this.scrollToLatestMessage();
    return indicateur;
  }

  /**
   * Retire l'indicateur de réflexion avec une animation
   * @param {HTMLElement} indicateur - L'élément à retirer
   */
  retirerIndicateurReflexion(indicateur) {
    if (indicateur && indicateur.parentNode) {
      indicateur.style.opacity = '0';
      indicateur.style.transform = 'translateY(-10px)';
      setTimeout(() => indicateur.remove(), 200);
    }
  }

  /**
   * Affiche le texte progressivement avec un effet de typing
   * @param {Message} messageObj - L'objet Message à mettre à jour
   * @param {string} texteComplet - Le texte complet à afficher
   */
  async afficherAvecEffetTyping(messageObj, texteComplet) {
    // Trouver l'élément du message dans le DOM
    const elementMessage = document.getElementById(messageObj.id);
    const elementTexte = elementMessage?.querySelector('.message__texte');

    if (!elementTexte) {
      // Fallback : afficher directement
      console.warn('Element texte non trouvé, affichage direct');
      messageObj.contenu = texteComplet;
      if (elementMessage) {
        const texteEl = elementMessage.querySelector('.message__texte');
        if (texteEl) texteEl.innerHTML = this.parserMarkdown(texteComplet);
      }
      return;
    }

    // Vitesse de typing (caractères par intervalle)
    const vitesseBase = 20; // caractères par tick
    const delaiTick = 25; // ms entre chaque tick

    let index = 0;
    const longueur = texteComplet.length;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        // Calculer combien de caractères ajouter (variable pour effet naturel)
        const variation = Math.floor(Math.random() * 10) - 5;
        const caractaresAAjouter = Math.max(8, vitesseBase + variation);

        index = Math.min(index + caractaresAAjouter, longueur);
        let textePartiel = texteComplet.substring(0, index);

        // Vérifier si on est dans un bloc de code non fermé
        const blocsOuverts = (textePartiel.match(/```/g) || []).length;
        const dansCodeNonFerme = blocsOuverts % 2 !== 0;

        // Si dans un bloc de code non fermé, afficher en texte brut temporairement
        if (dansCodeNonFerme) {
          // Parser basique sans les blocs de code
          let htmlTemp = textePartiel
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
          elementTexte.innerHTML = htmlTemp;
        } else {
          // Parser complet avec coloration
          elementTexte.innerHTML = this.parserMarkdown(textePartiel);
        }

        // Ajouter un curseur clignotant
        if (index < longueur) {
          elementTexte.innerHTML += '<span class="curseur-typing">|</span>';
        }

        // Scroll pendant le typing
        this.scrollToLatestMessage();

        // Fin du typing
        if (index >= longueur) {
          clearInterval(interval);
          messageObj.contenu = texteComplet;
          // Parser final complet pour s'assurer que tout est bien formaté
          elementTexte.innerHTML = this.parserMarkdown(texteComplet);
          resolve();
        }
      }, delaiTick);
    });
  }

  /**
   * Parse le markdown en HTML avec coloration syntaxique
   * Utilise le parser complet de markdown.js
   * @param {string} texte - Texte markdown
   * @returns {string} HTML formaté avec coloration
   */
  parserMarkdown(texte) {
    // Utiliser le parser complet avec coloration syntaxique
    return parseMarkdown(texte);
  }

  // 
  // PERSISTANCE DES MESSAGES
  // Ces méthodes gèrent la sauvegarde et la restauration de l'historique
  // 

  /**
   * Sauvegarde l'historique des messages dans le localStorage
   * 
   * Cette méthode est appelée automatiquement après chaque nouveau message.
   * Elle convertit les objets Message en format JSON pour le stockage.
   */
  sauvegarderHistorique() {
    // Convertir les messages en format simple pour le stockage
    const historiqueAEnregistrer = this.messages.map(msg => ({
      contenu: msg.contenu,
      type: msg.type,
      horodatage: msg.horodatage.toISOString(),
      etapes: msg.etapes || null
    }));

    // Sauvegarder dans le localStorage via le service storage
    setHistorique(historiqueAEnregistrer);
    console.log('💾 Historique sauvegardé:', historiqueAEnregistrer.length, 'messages');
  }

  /**
   * Restaure l'historique des messages depuis le localStorage
   * 
   * Cette méthode est appelée au démarrage de l'application.
   * Elle recrée les messages sauvegardés et les affiche dans le chat.
   */
  restaurerHistorique() {
    // Récupérer l'historique depuis le localStorage
    const historiqueSauvegarde = getHistorique();

    // Si pas d'historique, ne rien faire
    if (!historiqueSauvegarde || historiqueSauvegarde.length === 0) {
      console.log('📭 Aucun historique à restaurer');
      return;
    }

    console.log('📥 Restauration de', historiqueSauvegarde.length, 'messages...');

    // Recréer chaque message et l'afficher
    historiqueSauvegarde.forEach(donnees => {
      const message = new Message({
        contenu: donnees.contenu,
        type: donnees.type,
        horodatage: new Date(donnees.horodatage),
        etapes: donnees.etapes || null
      });

      // Ajouter au conteneur et à la liste
      this.ajouterMessage(message);
      this.messages.push(message);
    });

    // Scroller vers le bas après restauration
    this.forceScrollToBottom();
    console.log('✅ Historique restauré avec succès');
  }

  /**
   * Efface tout l'historique des messages
   * 
   * Cette méthode est appelée depuis les paramètres.
   * Elle vide à la fois l'affichage et le localStorage.
   */
  effacerHistorique() {
    // Vider la liste des messages
    this.messages = [];

    // Vider le localStorage
    setHistorique([]);

    // Vider l'affichage (garder le message de bienvenue)
    if (this.conteneurMessages) {
      const messageBienvenue = this.conteneurMessages.querySelector('.message-bienvenue');
      this.conteneurMessages.innerHTML = '';
      if (messageBienvenue) {
        this.conteneurMessages.appendChild(messageBienvenue);
      }
    }

    console.log('🗑️ Historique effacé');
  }
}

