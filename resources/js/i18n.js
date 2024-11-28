// resources/js/i18n.js

let translations = {};

export const loadTranslations = async (locale) => {
    console.log(`Chargement des traductions pour la langue: ${locale}`); // Log du locale demandé

    const response = await fetch(`http://127.0.0.1:8000/translations/${locale}`);
    if (response.ok) {
        translations = await response.json();
        console.log('Traductions chargées:', translations); // Log des traductions chargées
    } else {
        console.error('Échec du chargement des traductions');
    }
};

export const trans = (key, lang = 'fr') => { // Langue par défaut à 'fr'
    console.log(`Tentative de traduction de la clé: ${key} pour la langue: ${lang}`); // Log de la clé à traduire

    const keys = key.split('.');
    const result = keys.reduce((o, k) => (o || {})[k], translations) || key;

    if (result === key) {
        console.warn(`Clé de traduction non trouvée: ${key}`); // Avertir si la clé n'est pas trouvée
    } else {
        console.log(`Traduction trouvée pour ${key}: ${result}`); // Log de la traduction trouvée
    }

    return result;
};
