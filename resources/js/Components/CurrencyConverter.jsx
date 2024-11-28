import React, { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { mainCurrency } from '@/utils/constants';  // Importer mainCurrency

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [amount, setAmount] = useState('');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCurrencies = async () => {
            setLoading(true);
            try {
                const response = await fetch('/currencies');
                if (!response.ok) throw new Error('Échec du chargement des devises');
                
                const data = await response.json();
                setCurrencies([mainCurrency, ...data]);
                setSelectedCurrency(mainCurrency);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadCurrencies();
    }, [mainCurrency]);

    const handleConvert = async () => {
        if (!selectedCurrency || !amount) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const selectedValue = selectedCurrency.value_in_i_coin;
            const usdCurrency = currencies.find(c => c.code === 'USD');
            const converted =
                selectedCurrency.id === 0 && usdCurrency
                    ? amount / usdCurrency.value_in_i_coin
                    : amount * selectedValue;

            setConvertedAmount(converted || amount);
        } catch (error) {
            console.error('Erreur lors de la conversion:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setAmount('');
        setConvertedAmount(null);
        setSelectedCurrency(mainCurrency);
    };

    return (
        <div className="p-4 mx-auto max-w-4xl bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Convertisseur de devises</h2>

            {convertedAmount !== null && (
                <div className="mt-4 p-2 mb-4 rounded-md bg-[#cd8b76] text-white font-semibold shadow-md flex justify-between">
                    <span>Montant converti :</span>
                    <span className="font-bold text-xl">
                        {convertedAmount.toFixed(2)}{' '}
                        {selectedCurrency.id === 0 ? 'USD' : mainCurrency.name}
                    </span>
                </div>
            )}

            {loading && <div className="mt-4 text-center">Chargement en cours...</div>}

            <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Montant :
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Devise :
                </label>
                <select
                    id="currency"
                    value={selectedCurrency?.id || ''}
                    onChange={e => {
                        const currency = currencies.find(c => c.id === parseInt(e.target.value));
                        setSelectedCurrency(currency);
                        setConvertedAmount(null);
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    {currencies.map(currency => (
                        <option key={currency.id} value={currency.id}>
                            {currency.name} ({currency.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2">
                <PrimaryButton onClick={handleConvert} className="w-full">
                    Convertir
                </PrimaryButton>
                <SecondaryButton onClick={handleReset} className="w-full">
                    Réinitialiser
                </SecondaryButton>
            </div>
        </div>
    );
};

export default CurrencyConverter;
