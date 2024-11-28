// resources/js/utils/constants.js

export const mainCurrency = {
    id: 0,
    name: import.meta.env.VITE_MAIN_CURRENCY_NAME || "I-Coin",
    code: "I-Coin",
    value_in_i_coin: 1,
};

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const appDatas = {
  url: isLocal ? "http://127.0.0.1:8000" : "https://auth.imarket-consulting.com",
};
