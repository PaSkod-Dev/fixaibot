/* 
   Service : Storage (Stockage Local)
   Description : Gère la persistance des données dans le localStorage
   
   Ce service permet de :
   - Sauvegarder et récupérer des données de manière sécurisée
   - Gérer le thème de l'application (clair/sombre/auto)
   - Gérer le mode d'assistance actif (lite/core/pro)
   - Sauvegarder l'historique des conversations
   
   Toutes les clés sont préfixées par "fixo_" pour éviter les conflits
   avec d'autres applications utilisant le localStorage.
   
   Exemple d'utilisation :
   import { getTheme, setTheme, getHistorique, setHistorique } from './storage.js';
   
   // Récupérer le thème actuel
   const theme = getTheme(); // 'light', 'dark' ou 'auto'
   
   // Sauvegarder un nouveau thème
   setTheme('dark');
   
   Auteur : Équipe FIXƆ
   */

/**
 * Préfixe utilisé pour toutes les clés localStorage de FIXƆ
 * Cela évite les conflits avec d'autres applications
 */
const PREFIXE = 'fixo_';

/**
 * Sauvegarde une valeur dans le LocalStorage
 * @param {string} cle - Clé de stockage
 * @param {any} valeur - Valeur à sauvegarder
 */
export function sauvegarder(cle, valeur) {
  try {
    const valeurString = JSON.stringify(valeur);
    localStorage.setItem(PREFIXE + cle, valeurString);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
}

/**
 * Récupère une valeur du LocalStorage
 * @param {string} cle - Clé de stockage
 * @param {any} valeurDefaut - Valeur par défaut si la clé n'existe pas
 * @returns {any} Valeur récupérée ou valeur par défaut
 */
export function recuperer(cle, valeurDefaut = null) {
  try {
    const valeurString = localStorage.getItem(PREFIXE + cle);
    if (valeurString === null) {
      return valeurDefaut;
    }
    return JSON.parse(valeurString);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return valeurDefaut;
  }
}

/**
 * Supprime une valeur du LocalStorage
 * @param {string} cle - Clé à supprimer
 */
export function supprimer(cle) {
  try {
    localStorage.removeItem(PREFIXE + cle);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
}

/**
 * Vide tout le LocalStorage de FIXƆ
 */
export function vider() {
  try {
    const cles = Object.keys(localStorage);
    cles.forEach(cle => {
      if (cle.startsWith(PREFIXE)) {
        localStorage.removeItem(cle);
      }
    });
    return true;
  } catch (error) {
    console.error('Erreur lors du vidage:', error);
    return false;
  }
}

/**
 * Récupère le mode actif
 * @returns {string} Mode actif
 */
export function getModeActif() {
  return recuperer('mode', 'lite');
}

/**
 * Sauvegarde le mode actif
 * @param {string} mode - Mode à sauvegarder
 */
export function setModeActif(mode) {
  return sauvegarder('mode', mode);
}

/**
 * Récupère le thème actif
 * @returns {string} Thème actif ('light' ou 'dark')
 */
export function getTheme() {
  return recuperer('theme', 'dark');
}

/**
 * Sauvegarde le thème actif
 * @param {string} theme - Thème à sauvegarder
 */
export function setTheme(theme) {
  return sauvegarder('theme', theme);
}

/**
 * Récupère l'historique des conversations
 * @returns {Array} Historique des conversations
 */
export function getHistorique() {
  return recuperer('historique', []);
}

/**
 * Sauvegarde l'historique des conversations
 * @param {Array} historique - Historique à sauvegarder
 */
export function setHistorique(historique) {
  return sauvegarder('historique', historique);
}

// Alias pour compatibilité avec Settings.js
export const sauvegarderTheme = setTheme;
export const recupererTheme = getTheme;
export const sauvegarderMode = setModeActif;
export const recupererMode = getModeActif;

