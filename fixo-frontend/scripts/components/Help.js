/* 
   Composant : Help
   Description : Guide d'aide interactif pour les utilisateurs
   
   Ce composant affiche une icône d'aide (?) qui ouvre un panneau
   avec des guides pour utiliser FIXƆ (création clé API, etc.)
   
   Auteur : Équipe FIXƆ
   */

export class Help {
    constructor() {
        this.isOpen = false;
        this.currentSection = 'accueil';
        this.init();
    }

    /**
     * Initialise le composant d'aide
     */
    init() {
        this.creerBoutonAide();
        this.creerPanneauAide();
        this.attacherEvenements();
    }

    /**
     * Crée le bouton d'aide flottant
     */
    creerBoutonAide() {
        const bouton = document.createElement('button');
        bouton.id = 'btn-aide';
        bouton.className = 'btn-aide';
        bouton.setAttribute('aria-label', 'Aide');
        bouton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `;
        document.body.appendChild(bouton);
        this.boutonAide = bouton;
    }

    /**
     * Crée le panneau d'aide
     */
    creerPanneauAide() {
        const panneau = document.createElement('div');
        panneau.id = 'panneau-aide';
        panneau.className = 'panneau-aide';
        panneau.innerHTML = this.genererContenuAide();
        document.body.appendChild(panneau);
        this.panneauAide = panneau;
    }

    /**
     * Génère le contenu HTML du panneau d'aide
     */
    genererContenuAide() {
        return `
            <div class="aide-header">
                <h2 class="aide-titre">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Centre d'aide
                </h2>
                <button class="aide-fermer" aria-label="Fermer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="aide-navigation">
                <button class="aide-nav-btn active" data-section="accueil">Accueil</button>
                <button class="aide-nav-btn" data-section="api">Clé API</button>
                <button class="aide-nav-btn" data-section="modes">Modes</button>
                <button class="aide-nav-btn" data-section="faq">FAQ</button>
            </div>
            
            <div class="aide-contenu">
                ${this.genererSectionAccueil()}
                ${this.genererSectionAPI()}
                ${this.genererSectionModes()}
                ${this.genererSectionFAQ()}
            </div>
        `;
    }

    /**
     * Section Accueil
     */
    genererSectionAccueil() {
        return `
            <div class="aide-section active" data-section="accueil">
                <h3>Bienvenue dans FIXƆ !</h3>
                <p>FIXƆ est ton assistant de dépannage informatique intelligent, conçu pour le contexte africain.</p>
                
                <div class="aide-cards">
                    <div class="aide-card" data-goto="modes">
                        <div class="aide-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20V10"></path>
                                <path d="M18 20V4"></path>
                                <path d="M6 20v-4"></path>
                            </svg>
                        </div>
                        <h4>Choisir un mode</h4>
                        <p>Lite, Core ou Pro selon tes besoins</p>
                    </div>
                    <div class="aide-card" data-goto="api">
                        <div class="aide-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                            </svg>
                        </div>
                        <h4>Configurer l'API</h4>
                        <p>Activer le Mode Core avec Groq</p>
                    </div>
                    <div class="aide-card" data-goto="faq">
                        <div class="aide-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h4>Questions fréquentes</h4>
                        <p>Réponses aux questions courantes</p>
                    </div>
                </div>
                
                <div class="aide-astuce">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="astuce-icon">
                        <line x1="9" y1="18" x2="15" y2="18"></line>
                        <line x1="10" y1="22" x2="14" y2="22"></line>
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                    </svg>
                    <span><strong>Astuce :</strong> Tape ta question comme si tu parlais à un ami technicien !</span>
                </div>
            </div>
        `;
    }

    /**
     * Section Clé API
     */
    genererSectionAPI() {
        return `
            <div class="aide-section" data-section="api">
                <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="titre-icon">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                    Comment obtenir une clé API ?
                </h3>
                
                <p>FIXƆ utilise actuellement <strong>Groq</strong> (gratuit et rapide). D'autres fournisseurs seront disponibles prochainement.</p>
                
                <div class="aide-etapes">
                    <div class="aide-etape">
                        <span class="etape-numero">1</span>
                        <div class="etape-contenu">
                            <h4>Créer un compte</h4>
                            <p>Va sur <a href="https://console.groq.com" target="_blank" rel="noopener">console.groq.com</a> et inscris-toi avec Google ou email.</p>
                        </div>
                    </div>
                    
                    <div class="aide-etape">
                        <span class="etape-numero">2</span>
                        <div class="etape-contenu">
                            <h4>Accéder aux clés API</h4>
                            <p>Clique sur <strong>"API Keys"</strong> dans le menu à gauche.</p>
                        </div>
                    </div>
                    
                    <div class="aide-etape">
                        <span class="etape-numero">3</span>
                        <div class="etape-contenu">
                            <h4>Créer une clé</h4>
                            <p>Clique <strong>"Create API Key"</strong>, nomme-la "FIXO" et copie la clé générée.</p>
                        </div>
                    </div>
                    
                    <div class="aide-etape">
                        <span class="etape-numero">4</span>
                        <div class="etape-contenu">
                            <h4>Configurer FIXƆ</h4>
                            <p>Clique sur <strong>Paramètres</strong> (icône engrenage) puis <strong>Mode Core</strong> et colle ta clé.</p>
                        </div>
                    </div>
                </div>
                
                <div class="aide-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                        <strong>Pourquoi ta propre clé ?</strong>
                        <ul>
                            <li>Tes données restent privées (stockées localement)</li>
                            <li>Quota gratuit généreux (~100 requêtes/jour)</li>
                            <li>Pas de frais cachés ni d'abonnement</li>
                            <li>Tu contrôles ton usage</li>
                        </ul>
                    </div>
                </div>
                
                <div class="aide-astuce">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="astuce-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span><strong>Bientôt :</strong> Support pour OpenAI, Anthropic, et autres fournisseurs d'IA.</span>
                </div>
            </div>
        `;
    }

    /**
     * Section Modes
     */
    genererSectionModes() {
        return `
            <div class="aide-section" data-section="modes">
                <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="titre-icon">
                        <path d="M12 20V10"></path>
                        <path d="M18 20V4"></path>
                        <path d="M6 20v-4"></path>
                    </svg>
                    Les différents modes
                </h3>
                
                <div class="aide-mode">
                    <div class="mode-header mode-lite">
                        <span class="mode-badge">LITE</span>
                        <span class="mode-prix">Gratuit</span>
                    </div>
                    <div class="mode-body">
                        <p><strong>Base de connaissances locale</strong></p>
                        <ul>
                            <li>Fonctionne hors ligne</li>
                            <li>Réponses prédéfinies</li>
                            <li>Idéal pour les problèmes courants</li>
                        </ul>
                    </div>
                </div>
                
                <div class="aide-mode">
                    <div class="mode-header mode-core">
                        <span class="mode-badge">CORE</span>
                        <span class="mode-prix">Gratuit (avec clé API)</span>
                    </div>
                    <div class="mode-body">
                        <p><strong>Intelligence Artificielle</strong></p>
                        <ul>
                            <li>Réponses personnalisées</li>
                            <li>Peut coder et analyser</li>
                            <li>Contexte africain (prix en FCFA)</li>
                            <li>Nécessite une clé API Groq</li>
                        </ul>
                    </div>
                </div>
                
                <div class="aide-mode">
                    <div class="mode-header mode-pro">
                        <span class="mode-badge">PRO</span>
                        <span class="mode-prix">Bientôt disponible</span>
                    </div>
                    <div class="mode-body">
                        <p><strong>Fonctionnalités avancées</strong></p>
                        <ul>
                            <li>Diagnostic système automatique</li>
                            <li>Connexion à distance</li>
                            <li>Support prioritaire</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Section FAQ
     */
    genererSectionFAQ() {
        return `
            <div class="aide-section" data-section="faq">
                <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="titre-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Questions fréquentes
                </h3>
                
                <div class="aide-faq">
                    <details class="faq-item">
                        <summary>Pourquoi dois-je créer ma propre clé API ?</summary>
                        <p>Pour protéger ta vie privée et éviter les coûts partagés. Ta clé = tes données restent privées. De plus, Groq offre un quota gratuit généreux.</p>
                    </details>
                    
                    <details class="faq-item">
                        <summary>Mes données sont-elles sécurisées ?</summary>
                        <p>Oui ! Ta clé API et ton historique sont stockés uniquement sur ton appareil (localStorage). Rien n'est envoyé à nos serveurs.</p>
                    </details>
                    
                    <details class="faq-item">
                        <summary>FIXƆ fonctionne-t-il hors ligne ?</summary>
                        <p>Le Mode Lite fonctionne hors ligne. Le Mode Core nécessite une connexion internet pour contacter l'API.</p>
                    </details>
                    
                    <details class="faq-item">
                        <summary>Comment changer de thème (clair/sombre) ?</summary>
                        <p>Clique sur l'icône ⚙️ (Paramètres) puis sur "Apparence" pour basculer entre les thèmes.</p>
                    </details>
                    
                    <details class="faq-item">
                        <summary>Puis-je utiliser FIXƆ sur mobile ?</summary>
                        <p>Oui ! FIXƆ est responsive et s'adapte à tous les écrans. Tu peux même l'installer comme application (PWA).</p>
                    </details>
                    
                    <details class="faq-item">
                        <summary>Comment effacer mon historique ?</summary>
                        <p>Va dans Paramètres → Données → "Effacer l'historique".</p>
                    </details>
                </div>
            </div>
        `;
    }

    /**
     * Attache les événements
     */
    attacherEvenements() {
        // Ouvrir/fermer le panneau
        this.boutonAide.addEventListener('click', () => this.toggle());

        // Fermer avec le bouton X
        this.panneauAide.querySelector('.aide-fermer').addEventListener('click', () => this.fermer());

        // Navigation entre sections
        this.panneauAide.querySelectorAll('.aide-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.afficherSection(section);
            });
        });

        // Cards cliquables
        this.panneauAide.querySelectorAll('.aide-card[data-goto]').forEach(card => {
            card.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.goto;
                this.afficherSection(section);
            });
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.fermer();
            }
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.panneauAide.contains(e.target) &&
                !this.boutonAide.contains(e.target)) {
                this.fermer();
            }
        });
    }

    /**
     * Affiche une section spécifique
     */
    afficherSection(sectionId) {
        // Mettre à jour la navigation
        this.panneauAide.querySelectorAll('.aide-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });

        // Afficher la section
        this.panneauAide.querySelectorAll('.aide-section').forEach(section => {
            section.classList.toggle('active', section.dataset.section === sectionId);
        });

        this.currentSection = sectionId;
    }

    /**
     * Ouvre ou ferme le panneau
     */
    toggle() {
        if (this.isOpen) {
            this.fermer();
        } else {
            this.ouvrir();
        }
    }

    /**
     * Ouvre le panneau
     */
    ouvrir() {
        this.isOpen = true;
        this.panneauAide.classList.add('open');
        this.boutonAide.classList.add('active');
    }

    /**
     * Ferme le panneau
     */
    fermer() {
        this.isOpen = false;
        this.panneauAide.classList.remove('open');
        this.boutonAide.classList.remove('active');
    }
}
