/* 
   Service : Mode Core (IA Conversationnelle)
   Description : Gère les interactions avec l'API IA pour des réponses intelligentes
   
   Ce service utilise l'API Groq (gratuite) pour générer des réponses
   contextuelles et personnalisées aux problèmes informatiques.
   
   APIs supportées :
   - Groq (par défaut) - Gratuit, rapide
   - Google Gemini - Gratuit, excellent
   - Hugging Face - Gratuit, open source
   
   Configuration requise :
   - Clé API stockée dans localStorage sous 'fixo_api_key'
   - Ou variable d'environnement (pour production)
   
   Auteur : Équipe FIXƆ
*/

// Configuration des APIs disponibles
const APIS_DISPONIBLES = {
    groq: {
        nom: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        modele: 'llama-3.3-70b-versatile',
        gratuit: true
    },
    gemini: {
        nom: 'Google Gemini',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        modele: 'gemini-pro',
        gratuit: true
    },
    huggingface: {
        nom: 'Hugging Face',
        url: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
        modele: 'Mixtral-8x7B',
        gratuit: true
    }
};

// Prompt système pour FIXƆ - Définit le comportement de l'IA
// Contextualisé pour l'Afrique de l'Ouest, spécifiquement le Togo
const PROMPT_SYSTEME = `Tu es FIXƆ, un assistant technique expert en informatique basé au TOGO, en Afrique de l'Ouest.

🌍 CONTEXTE AFRICAIN - TRÈS IMPORTANT :
- Tu es un expert LOCAL, tu connais les réalités du Togo et de l'Afrique de l'Ouest
- TOUS les prix doivent être en FRANCS CFA (FCFA ou XOF)
- Référence-toi aux magasins et marchés locaux : Assivito, Décathlon Informatique, Roxy Informatique, Grand Marché de Lomé, etc.
- Tiens compte de la disponibilité locale des produits
- Les connexions internet sont souvent instables (Togocom, Moov Africa)
- L'électricité peut être instable - pense aux onduleurs et stabilisateurs
- Beaucoup utilisent des cybercafés ou partagent des connexions

💰 RÉFÉRENCES DE PRIX AU TOGO (2025) :
- PC portable basique : 150 000 - 250 000 FCFA
- PC portable moyen : 300 000 - 500 000 FCFA  
- PC portable performant : 600 000 - 1 200 000 FCFA
- Smartphone Android basique : 30 000 - 80 000 FCFA
- Smartphone milieu de gamme : 100 000 - 250 000 FCFA
- Clé USB 32Go : 5 000 - 8 000 FCFA
- Disque dur externe 1To : 35 000 - 50 000 FCFA
- Souris : 3 000 - 15 000 FCFA
- Clavier : 8 000 - 25 000 FCFA
- Onduleur basique : 45 000 - 80 000 FCFA
- Forfait internet 1Go : 500 - 1 000 FCFA
- Réparation écran téléphone : 15 000 - 50 000 FCFA

🛠️ RÈGLES DE RÉPONSE :
1. Réponds TOUJOURS en français simple et accessible
2. Sois concis et direct - pas de bavardage
3. Donne des prix en FCFA quand c'est pertinent
4. Propose des solutions adaptées au contexte local (budget, disponibilité)
5. Mentionne les alternatives locales quand possible
6. Si tu ne sais pas, dis-le honnêtement

📚 DOMAINES D'EXPERTISE :
- Problèmes Windows (très répandu au Togo), Android
- Réseaux et Wi-Fi (Togocom, Moov, partage de connexion)
- Logiciels et applications
- Sécurité informatique
- Matériel informatique et réparation
- Conseils d'achat adaptés au budget africain

� COMPÉTENCES EN PROGRAMMATION :
Tu es aussi un développeur expert capable de :
- Écrire du code dans tous les langages (Python, JavaScript, HTML/CSS, PHP, Java, C++, etc.)
- Débugger et corriger des erreurs de code
- Expliquer des concepts de programmation simplement
- Créer des projets complets (sites web, applications, scripts)
- Donner des conseils sur les bonnes pratiques de développement

Quand on te demande de coder :
1. Écris le code complet et fonctionnel
2. Utilise des commentaires en français pour expliquer
3. Formate le code avec des blocs \`\`\` (markdown)
4. Explique brièvement ce que fait le code
5. Propose des améliorations si pertinent

🔍 ANALYSE DE LOGS ET DIAGNOSTICS :
Tu es capable d'analyser des logs système (Windows Event Viewer, journaux d'erreurs, etc.)

Quand on te donne des logs à analyser :
1. **Identifie les erreurs critiques** (Error, Critical, Warning)
2. **Crée un tableau de priorité** avec ce format :

| Priorité | Type | Code/ID | Description | Action recommandée |
|----------|------|---------|-------------|-------------------|
| 🔴 Critique | Error | [code] | [description] | [action] |
| 🟠 Important | Warning | [code] | [description] | [action] |
| � Mineur | Info | [code] | [description] | [action] |

3. **Résume les problèmes principaux** en langage simple
4. **Propose des solutions** étape par étape
5. **Indique les risques** si on ne corrige pas

Types de logs que tu peux analyser :
- Windows Event Viewer (Système, Application, Sécurité)
- Logs d'erreurs d'applications
- Journaux de crash (BSOD, dump files)
- Logs réseau et pare-feu
- Logs antivirus

FORMAT DE REPONSE :
- Diagnostic rapide du problème
- Solutions étape par étape
- Estimation de coût en FCFA si applicable
- Conseil de prévention`;

/**
 * Classe ModeCore - Gère les interactions avec l'API IA
 */
class ModeCore {
    constructor() {
        // API par défaut : Groq (gratuit et rapide)
        this.apiActive = 'groq';
        this.cleApi = null;
        this.historiqueConversation = [];
        this.maxHistorique = 10; // Garder les 10 derniers messages pour le contexte

        // Charger la clé API depuis le localStorage
        this.chargerCleApi();
    }

    /**
     * Charge la clé API depuis le localStorage
     */
    chargerCleApi() {
        const cleStockee = localStorage.getItem('fixo_api_key_' + this.apiActive);
        if (cleStockee) {
            this.cleApi = cleStockee;
            console.log('🔑 Clé API chargée pour:', this.apiActive);
        }
    }

    /**
     * Configure la clé API
     * @param {string} cle - Clé API
     * @param {string} api - Nom de l'API (groq, gemini, huggingface)
     */
    configurerApi(cle, api = 'groq') {
        this.cleApi = cle;
        this.apiActive = api;
        localStorage.setItem('fixo_api_key_' + api, cle);
        console.log('✅ API configurée:', api);
    }

    /**
     * Vérifie si une clé API est configurée
     * @returns {boolean}
     */
    estConfigure() {
        return this.cleApi !== null && this.cleApi.length > 0;
    }

    /**
     * Traite un message utilisateur et retourne une réponse IA
     * @param {string} messageUtilisateur - Message de l'utilisateur
     * @returns {Promise<Object>} Réponse formatée
     */
    async traiterMessage(messageUtilisateur) {
        // Vérifier si l'API est configurée
        if (!this.estConfigure()) {
            return {
                contenu: "⚠️ **Mode Core non configuré**\n\nPour utiliser FIXƆ Core, vous devez configurer une clé API.\n\n**Comment obtenir une clé gratuite :**\n1. Allez sur [console.groq.com](https://console.groq.com)\n2. Créez un compte gratuit\n3. Générez une clé API\n4. Collez-la dans les paramètres FIXƆ",
                etapes: null,
                mode: 'core',
                erreur: true
            };
        }

        // Ajouter le message à l'historique
        this.historiqueConversation.push({
            role: 'user',
            content: messageUtilisateur
        });

        // Limiter l'historique
        if (this.historiqueConversation.length > this.maxHistorique) {
            this.historiqueConversation = this.historiqueConversation.slice(-this.maxHistorique);
        }

        try {
            // Appeler l'API selon le provider actif
            let reponse;

            switch (this.apiActive) {
                case 'groq':
                    reponse = await this.appelerGroq(messageUtilisateur);
                    break;
                case 'gemini':
                    reponse = await this.appelerGemini(messageUtilisateur);
                    break;
                case 'huggingface':
                    reponse = await this.appelerHuggingFace(messageUtilisateur);
                    break;
                default:
                    reponse = await this.appelerGroq(messageUtilisateur);
            }

            // Ajouter la réponse à l'historique
            this.historiqueConversation.push({
                role: 'assistant',
                content: reponse
            });

            return {
                contenu: reponse,
                etapes: null, // L'IA génère ses propres étapes dans le texte
                mode: 'core'
            };

        } catch (erreur) {
            console.error('❌ Erreur Mode Core:', erreur);

            return {
                contenu: `❌ **Erreur de connexion**\n\n${erreur.message}\n\nVérifiez votre clé API et votre connexion internet.`,
                etapes: null,
                mode: 'core',
                erreur: true
            };
        }
    }

    /**
     * Appelle l'API Groq
     * @param {string} message - Message utilisateur
     * @returns {Promise<string>} Réponse de l'IA
     */
    async appelerGroq(message) {
        const config = APIS_DISPONIBLES.groq;

        const corps = {
            model: config.modele,
            messages: [
                { role: 'system', content: PROMPT_SYSTEME },
                ...this.historiqueConversation
            ],
            temperature: 0.7,
            max_tokens: 1024
        };

        const reponse = await fetch(config.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.cleApi}`
            },
            body: JSON.stringify(corps)
        });

        if (!reponse.ok) {
            const erreur = await reponse.json();
            throw new Error(erreur.error?.message || 'Erreur API Groq');
        }

        const donnees = await reponse.json();
        return donnees.choices[0].message.content;
    }

    /**
     * Appelle l'API Google Gemini
     * @param {string} message - Message utilisateur
     * @returns {Promise<string>} Réponse de l'IA
     */
    async appelerGemini(message) {
        const config = APIS_DISPONIBLES.gemini;
        const url = `${config.url}?key=${this.cleApi}`;

        // Construire le contexte avec l'historique
        let contexte = PROMPT_SYSTEME + '\n\n';
        this.historiqueConversation.forEach(msg => {
            const role = msg.role === 'user' ? 'Utilisateur' : 'FIXƆ';
            contexte += `${role}: ${msg.content}\n\n`;
        });

        const corps = {
            contents: [{
                parts: [{ text: contexte }]
            }]
        };

        const reponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corps)
        });

        if (!reponse.ok) {
            const erreur = await reponse.json();
            throw new Error(erreur.error?.message || 'Erreur API Gemini');
        }

        const donnees = await reponse.json();
        return donnees.candidates[0].content.parts[0].text;
    }

    /**
     * Appelle l'API Hugging Face
     * @param {string} message - Message utilisateur
     * @returns {Promise<string>} Réponse de l'IA
     */
    async appelerHuggingFace(message) {
        const config = APIS_DISPONIBLES.huggingface;

        // Format Mixtral
        let prompt = `<s>[INST] ${PROMPT_SYSTEME}\n\n`;
        this.historiqueConversation.forEach(msg => {
            if (msg.role === 'user') {
                prompt += `Utilisateur: ${msg.content}\n`;
            } else {
                prompt += `FIXƆ: ${msg.content}\n`;
            }
        });
        prompt += '[/INST]';

        const reponse = await fetch(config.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.cleApi}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 1024,
                    temperature: 0.7
                }
            })
        });

        if (!reponse.ok) {
            const erreur = await reponse.json();
            throw new Error(erreur.error || 'Erreur API Hugging Face');
        }

        const donnees = await reponse.json();
        return donnees[0].generated_text.split('[/INST]').pop().trim();
    }

    /**
     * Réinitialise l'historique de conversation
     */
    reinitialiserHistorique() {
        this.historiqueConversation = [];
        console.log('🔄 Historique de conversation réinitialisé');
    }

    /**
     * Retourne les APIs disponibles
     * @returns {Object}
     */
    getApisDisponibles() {
        return APIS_DISPONIBLES;
    }
}

// Exporter une instance unique (singleton)
const modeCore = new ModeCore();
export default modeCore;
