/* 
   FIXƆ - Parseur Markdown Simple
   Convertit le texte Markdown en HTML
   */

/**
 * Convertit du texte Markdown en HTML
 * Supporte: gras, italique, code inline, blocs de code, liens, listes
 * @param {string} text - Texte en Markdown
 * @returns {string} HTML formaté
 */
export function parseMarkdown(text) {
    if (!text) return '';

    let html = text;

    // Échapper les caractères HTML dangereux d'abord
    html = escapeHtml(html);

    // Blocs de code (```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        const codeColore = colorerSyntaxe(code.trim(), language);
        const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
        return `
            <div class="code-block-wrapper">
                <div class="code-block-header">
                    <span class="code-block-lang">${language}</span>
                    <button class="code-block-copy" data-code-id="${codeId}" onclick="copierCode(this, '${codeId}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copier</span>
                    </button>
                </div>
                <pre class="code-block has-header" data-language="${language}"><code id="${codeId}">${codeColore}</code></pre>
            </div>`;
    });

    // Code inline (`)
    html = html.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');

    // Gras (**texte** ou __texte__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italique (*texte* ou _texte_)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Liens [texte](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Titres (### Titre)
    html = html.replace(/^### (.+)$/gm, '<h4 class="md-heading">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 class="md-heading">$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2 class="md-heading">$1</h2>');

    // Listes à puces (- item ou * item)
    html = html.replace(/^[\-\*] (.+)$/gm, '<li class="md-list-item">$1</li>');
    // Envelopper les li consécutifs dans ul
    html = html.replace(/(<li class="md-list-item">.*<\/li>\n?)+/g, (match) => {
        return `<ul class="md-list">${match}</ul>`;
    });

    // Listes numérotées (1. item)
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-list-item-num">$1</li>');
    html = html.replace(/(<li class="md-list-item-num">.*<\/li>\n?)+/g, (match) => {
        return `<ol class="md-list-ordered">${match}</ol>`;
    });

    // Citations (> texte)
    html = html.replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>');

    // Tableaux markdown
    html = parserTableaux(html);

    // Lignes horizontales (---)
    html = html.replace(/^---$/gm, '<hr class="md-hr">');

    // Retours à la ligne
    html = html.replace(/\n/g, '<br>');

    // Nettoyer les <br> après les blocs
    html = html.replace(/<\/pre><br>/g, '</pre>');
    html = html.replace(/<\/ul><br>/g, '</ul>');
    html = html.replace(/<\/ol><br>/g, '</ol>');
    html = html.replace(/<\/blockquote><br>/g, '</blockquote>');
    html = html.replace(/<\/h[234]><br>/g, (match) => match.replace('<br>', ''));
    html = html.replace(/<\/table><\/div><br>/g, '</table></div>');
    html = html.replace(/<\/div><br><div class="md-table/g, '</div><div class="md-table');

    return html;
}

/**
 * Parse les tableaux markdown en HTML
 * @param {string} text - Texte contenant potentiellement des tableaux
 * @returns {string} Texte avec tableaux convertis en HTML
 */
function parserTableaux(text) {
    // Regex pour détecter un tableau markdown
    // Ligne d'en-tête | col1 | col2 |
    // Ligne séparateur |---|---|
    // Lignes de données | val1 | val2 |
    const tableauRegex = /(\|[^\n]+\|\n)(\|[-:\s|]+\|\n)((?:\|[^\n]+\|\n?)+)/g;

    return text.replace(tableauRegex, (match, headerLine, separatorLine, bodyLines) => {
        // Parser l'en-tête
        const headers = headerLine
            .trim()
            .split('|')
            .filter(cell => cell.trim() !== '')
            .map(cell => cell.trim());

        // Parser les lignes du corps
        const rows = bodyLines
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line =>
                line
                    .split('|')
                    .filter(cell => cell !== '')
                    .map(cell => cell.trim())
            );

        // Construire le HTML du tableau
        let tableHtml = '<div class="md-table-wrapper"><table class="md-table">';

        // En-tête
        tableHtml += '<thead><tr>';
        headers.forEach(header => {
            tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead>';

        // Corps
        tableHtml += '<tbody>';
        rows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody>';

        tableHtml += '</table></div>';
        return tableHtml;
    });
}

/**
 * Échappe les caractères HTML dangereux
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Coloration syntaxique basique pour différents langages
 * @param {string} code - Code à colorier
 * @param {string} lang - Langage du code
 * @returns {string} Code avec balises de coloration
 */
function colorerSyntaxe(code, lang) {
    // Mots-clés par langage
    const motsClés = {
        javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof'],
        python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'with', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'yield', 'async', 'await'],
        html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'script', 'style', 'link', 'meta', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'nav', 'section', 'article', 'aside', 'main'],
        css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height', 'top', 'left', 'right', 'bottom', 'flex', 'grid', 'transform', 'transition', 'animation'],
        php: ['function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'const', 'echo', 'print', 'require', 'include', 'use', 'namespace', 'true', 'false', 'null'],
        java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'String', 'boolean', 'double', 'float', 'long', 'char', 'byte', 'short', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super', 'true', 'false', 'null', 'import', 'package']
    };

    // Obtenir les mots-clés pour ce langage (ou JavaScript par défaut)
    const langLower = lang.toLowerCase();
    const keywords = motsClés[langLower] || motsClés['javascript'] || [];

    let resultat = code;

    // Colorer les commentaires (// et /* */)
    resultat = resultat.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    resultat = resultat.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    // Commentaires Python (#)
    if (langLower === 'python') {
        resultat = resultat.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    }

    // Colorer les chaînes de caractères
    resultat = resultat.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    resultat = resultat.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
    resultat = resultat.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="string">$1</span>');

    // Colorer les nombres
    resultat = resultat.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

    // Colorer les mots-clés
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        resultat = resultat.replace(regex, '<span class="keyword">$1</span>');
    });

    // Colorer les fonctions (mot suivi de parenthèses)
    resultat = resultat.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function">$1</span>(');

    return resultat;
}

export default { parseMarkdown };
