/* 
   FIXƆ - Constantes
   */

/**
 * Constantes de l'application FIXƆ
 */

// Modes disponibles
export const MODES = {
  CORE: 'core',
  LITE: 'lite',
  PRO: 'pro'
};

// Noms des modes
export const NOMS_MODES = {
  [MODES.CORE]: 'FIXƆ Core',
  [MODES.LITE]: 'FIXƆ Lite',
  [MODES.PRO]: 'FIXƆ Pro'
};

// Catégories de problèmes
export const CATEGORIES = {
  PLATEFORME: 'plateforme',
  RESEAU: 'reseau',
  SYSTEME: 'systeme',
  MATERIEL: 'materiel',
  LOGICIEL: 'logiciel'
};

// Statuts de message
export const STATUTS_MESSAGE = {
  ENVOYE: 'envoye',
  RECU: 'recu',
  ERREUR: 'erreur'
};

// Types de message
export const TYPES_MESSAGE = {
  UTILISATEUR: 'utilisateur',
  ASSISTANT: 'assistant'
};

// Chemins des fichiers
export const CHEMINS = {
  PROBLEMES_JSON: 'data/problemes.json'
};

// Messages par défaut
export const MESSAGES_DEFAUT = {
  BIENVENUE: 'Bonjour ! Je suis FIXƆ, votre assistant de dépannage informatique.',
  AUCUN_PROBLEME: 'Je n\'ai pas trouvé de solution exacte pour votre problème. Pouvez-vous être plus précis ?',
  ERREUR: 'Une erreur est survenue. Veuillez réessayer.',
  CHARGEMENT: 'Analyse en cours...'
};

