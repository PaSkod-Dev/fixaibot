/* 
   FIXƆ - Mode Lite (Règles et arbre de décision)
   */

import { normaliserTexte } from '../utils/helpers.js';
import { CATEGORIES, MESSAGES_DEFAUT } from '../utils/constants.js';

/**
 * Classe ModeLite - Gestion du mode Lite avec règles et arbre de décision
 */
class ModeLite {
  constructor() {
    this.problemes = [];
    this.charge = false;

    // Mots-clés par catégorie pour identification rapide
    this.motsCles = {
      plateforme: ['site', 'notes', 'inscription', 'université', 'compte', 'plateforme', 'surchargé'],
      reseau: ['wifi', 'internet', 'connexion', 'lent', 'routeur', 'réseau', 'connecter', 'déconnecte'],
      systeme: ['lent', 'rame', 'écran', 'bleu', 'boot', 'bios', 'windows', 'démarre', 'allume', 'performance'],
      materiel: ['imprimante', 'usb', 'clavier', 'souris', 'batterie', 'écran', 'moniteur', 'disque'],
      logiciel: ['installe', 'erreur', 'plante', 'office', 'zoom', 'meet', 'teams', 'visio', 'application']
    };

    // Charger les problèmes au démarrage
    this.chargerProblemes();
  }

  /**
   * Charge les problèmes depuis le fichier JSON
   */
  async chargerProblemes() {
    if (this.charge) {
      console.log('Mode Lite: Problèmes déjà chargés');
      return;
    }

    try {
      console.log('Mode Lite: Chargement des problèmes...');
      const response = await fetch('data/problemes.json');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.problemes = data.problemes || [];
      this.charge = true;
      console.log(`✅ Mode Lite: ${this.problemes.length} problèmes chargés`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des problèmes:', error);
      console.error('Vérifiez que le serveur web est bien démarré et que data/problemes.json existe');
      this.problemes = [];
      // Ne pas bloquer l'application, continuer avec une liste vide
    }
  }

  /**
   * Traite un message utilisateur et retourne une réponse
   * @param {string} message - Message de l'utilisateur
   * @param {Object} contexte - Contexte additionnel (optionnel)
   * @returns {Promise<Object>} Réponse avec contenu et étapes
   */
  async traiterMessage(message, contexte = {}) {
    // Attendre que les problèmes soient chargés
    if (!this.charge) {
      await this.chargerProblemes();
    }

    // Normaliser le message
    const messageNormalise = normaliserTexte(message);

    if (!messageNormalise || messageNormalise.length < 3) {
      return {
        succes: true,
        contenu: MESSAGES_DEFAUT.AUCUN_PROBLEME,
        etapes: null,
        mode: 'lite',
        probleme: null
      };
    }

    // Identifier la catégorie
    const categorie = this.identifierCategorie(messageNormalise);

    // Trouver le problème correspondant
    const probleme = this.trouverProbleme(messageNormalise, categorie);

    if (probleme) {
      // Problème trouvé - retourner la solution
      return {
        succes: true,
        contenu: `**${probleme.titre}**\n\n${probleme.solution.resume}`,
        etapes: probleme.solution.etapes || [],
        mode: 'lite',
        probleme: {
          code: probleme.code,
          titre: probleme.titre,
          categorie: probleme.categorie
        }
      };
    }

    // Aucun problème trouvé - réponse par défaut selon la catégorie
    return {
      succes: true,
      contenu: this.genererReponseDefaut(categorie),
      etapes: null,
      mode: 'lite',
      probleme: null
    };
  }

  /**
   * Identifie la catégorie du problème à partir du message
   * @param {string} messageNormalise - Message normalisé
   * @returns {string} Catégorie identifiée
   */
  identifierCategorie(messageNormalise) {
    const scores = {};

    // Calculer le score pour chaque catégorie
    for (const [categorie, mots] of Object.entries(this.motsCles)) {
      scores[categorie] = 0;
      for (const mot of mots) {
        const motNormalise = normaliserTexte(mot);
        if (messageNormalise.includes(motNormalise)) {
          scores[categorie]++;
        }
      }
    }

    // Trouver la catégorie avec le score le plus élevé
    const meilleureCategorie = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    // Si aucun score, retourner 'general'
    if (scores[meilleureCategorie] === 0) {
      return 'general';
    }

    return meilleureCategorie;
  }

  /**
   * Trouve le problème correspondant au message
   * @param {string} messageNormalise - Message normalisé
   * @param {string} categorie - Catégorie identifiée
   * @returns {Object|null} Problème trouvé ou null
   */
  trouverProbleme(messageNormalise, categorie) {
    let meilleurProbleme = null;
    let meilleurScore = 0;

    // Extraire les mots du message
    const motsMessage = new Set(messageNormalise.split(' ').filter(m => m.length > 2));

    // Parcourir les problèmes
    for (const probleme of this.problemes) {
      // Filtrer par catégorie si ce n'est pas 'general'
      if (categorie !== 'general' && probleme.categorie !== categorie) {
        continue;
      }

      // Normaliser les mots-clés du problème
      const motsClesNormalises = probleme.motsClés.map(mc => normaliserTexte(mc));
      const motsProbleme = new Set();

      motsClesNormalises.forEach(mc => {
        mc.split(' ').forEach(mot => {
          if (mot.length > 2) {
            motsProbleme.add(mot);
          }
        });
      });

      // Calculer le score de correspondance
      const intersection = [...motsMessage].filter(m => motsProbleme.has(m));
      const score = intersection.length;

      // Garder le problème avec le meilleur score
      if (score > meilleurScore && score >= 2) {
        meilleurScore = score;
        meilleurProbleme = probleme;
      }
    }

    return meilleurProbleme;
  }

  /**
   * Génère une réponse par défaut selon la catégorie
   * @param {string} categorie - Catégorie identifiée
   * @returns {string} Réponse par défaut
   */
  genererReponseDefaut(categorie) {
    const reponses = {
      plateforme: 'Problème avec la plateforme universitaire ? Précisez : connexion, notes, inscription ou autre ?',
      reseau: 'Souci réseau ? Le Wi-Fi est lent, instable ou impossible à connecter ? Décrivez votre problème.',
      systeme: 'Problème système ? PC lent, écran bleu, ou souci de démarrage ? Donnez plus de détails.',
      materiel: 'Quel appareil pose problème : imprimante, USB, écran, batterie, clavier, souris ?',
      logiciel: 'Quel logiciel et quel message d\'erreur voyez-vous ? Décrivez le problème précisément.',
      general: 'Bonjour ! Je suis FIXƆ 🤖 Décrivez votre problème informatique en détail et je vous aiderai à le résoudre.'
    };

    return reponses[categorie] || reponses.general;
  }
}

// Exporter une instance unique (singleton)
export default new ModeLite();

