// resources/js/utils/helpers.js

export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Ajoutez d'autres fonctions utilitaires
export const formatCurrency = (value) => {
    return value.toFixed(2);
};
