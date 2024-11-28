import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-hot-toast";
import { mainCurrency } from "@/utils/constants";

export default function Create({ auth, depositMethods, withdrawalMethods }) {
    const { flash } = usePage().props; // Accès aux messages flash du backend
    const [selectedDepositMethod, setSelectedDepositMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const { data, setData, post, errors, reset } = useForm({
        transactionType: "",
        amount: "",
        recipientUsername: "",
        depositMethod: "",
        withdrawalMethod: "",
        currency: "",
        selectedCurrency: "",
        walletAddress: "",
    });

    /* useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success); // Afficher le message de succès
        }
        if (flash?.error) {
            toast.error(flash.error); // Afficher le message d'erreur
        }
    }, [flash]); // Déclenche l'effet lorsque `flash` change
 */
    const loadCurrencies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/currencies`);
            if (response.ok) {
                const data = await response.json();
                //console.log("Données des devises:", data);  // Log des données reçues

                // Assurez-vous que chaque devise a un ID unique
                const currenciesWithMain = [mainCurrency, ...data];
                setCurrencies(currenciesWithMain);
                //console.log("Devise reçue:", currenciesWithMain[0]);  // Log de la devise sélectionnée avec son ID
            } else {
                console.error("Échec du chargement des devises");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des devises:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrencies();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Vérification de la devise pour les autres types de transaction
        if (data.transactionType !== "transfer" && !selectedCurrency) {
            toast.error("Veuillez sélectionner une devise.");
            return;
        }

        // Préparation des données de transaction
        const transactionData = {
            ...data,
            currency:
                data.transactionType === "transfer"
                    ? null
                    : selectedCurrency.id, // Si "transfer", la devise est null
            withdrawalMethod: data.withdrawalMethod, // Méthode de retrait
            walletAddress: data.walletAddress, // Adresse du wallet ou numéro de compte
            amount: data.amount, // Montant
        };

        // Définition de l'URL en fonction du type de transaction
        const url =
            {
                deposit: "/transactions/deposit",
                withdraw: "/transactions/withdraw",
                transfer: "/transactions/transfer",
            }[data.transactionType] || "/transactions/transfer"; // Default au type "transfer" si non reconnu

        // Envoi de la requête
        post(url, {
            data: transactionData,
            onSuccess: () => {
                const successMessages = {
                    deposit: "Votre dépôt est en attente de validation.",
                    transfer: "Votre transfert est en attente de validation !",
                    withdraw: "Votre demande de retrait a été soumise.",
                };
                toast.success(
                    successMessages[data.transactionType] ||
                        "Transaction réussie."
                );
                reset(); // Réinitialisation des champs du formulaire
            },
            onError: (errors) => {
                // Gestion des erreurs
                Object.values(errors).forEach((error) => toast.error(error));
            },
        });
    };

    // Logique pour la copie de l'adresse dans la méthode de dépôt
    const handleCopy = (value, event) => {
        event.preventDefault(); // Empêche la soumission du formulaire
        navigator.clipboard.writeText(value);
        toast.success("Adresse copiée avec succès !");
    };

    const handleDepositMethodChange = (e) => {
        const selectedMethod = depositMethods.find(
            (method) => method.id === parseInt(e.target.value)
        );

        setSelectedDepositMethod(selectedMethod || null);
        setData("depositMethod", e.target.value);
    };

    const handleWithdrawalMethodChange = (e) => {
        const selectedMethod = withdrawalMethods.find(
            (method) => method.id === parseInt(e.target.value)
        );

        setData("withdrawalMethod", selectedMethod ? selectedMethod.id : "");
    };

    const handleCurrencyChange = (e) => {
        const currency = currencies.find(
            (c) => c.id === parseInt(e.target.value)
        );
        setSelectedCurrency(currency);
        setData("currency", currency ? currency.id : ""); // Mise à jour de `data.currency`
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Faire une transaction
                </h2>
            }
        >
            <Head title="Faire une transaction" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        Type de transaction
                                    </label>
                                    <select
                                        value={data.transactionType}
                                        onChange={(e) =>
                                            setData(
                                                "transactionType",
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">
                                            Choisissez le type de transaction
                                        </option>
                                        <option value="transfer">
                                            Transfert
                                        </option>
                                        <option value="deposit">Dépôt</option>
                                        <option value="withdraw">
                                            Retrait
                                        </option>
                                    </select>
                                    {errors.transactionType && (
                                        <div className="text-red-500">
                                            {errors.transactionType}
                                        </div>
                                    )}
                                </div>

                                {/* Champs spécifiques au transfert */}
                                {data.transactionType === "transfer" && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Nom d'utilisateur du
                                                destinataire
                                            </label>
                                            <input
                                                type="text"
                                                value={data.recipientUsername}
                                                onChange={(e) =>
                                                    setData(
                                                        "recipientUsername",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Nom d'utilisateur du destinataire"
                                            />
                                            {errors.recipientUsername && (
                                                <div className="text-red-500">
                                                    {errors.recipientUsername}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Montant en {mainCurrency.name}
                                            </label>
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Montant"
                                            />
                                            {errors.amount && (
                                                <div className="text-red-500">
                                                    {errors.amount}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Champs spécifiques au dépôt */}
                                {data.transactionType === "deposit" && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Méthode de dépôt
                                            </label>
                                            <select
                                                value={data.depositMethod}
                                                onChange={
                                                    handleDepositMethodChange
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="">
                                                    Choisissez une méthode de
                                                    dépôt
                                                </option>
                                                {depositMethods.map(
                                                    (method) => (
                                                        <option
                                                            key={method.id}
                                                            value={method.id}
                                                        >
                                                            {method.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            {errors.depositMethod && (
                                                <div className="text-red-500">
                                                    {errors.depositMethod}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="currency"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Devise :
                                            </label>
                                            <select
                                                id="currency"
                                                value={
                                                    selectedCurrency
                                                        ? selectedCurrency.id
                                                        : ""
                                                }
                                                onChange={handleCurrencyChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            >
                                                {/* Option par défaut pour sélectionner une devise */}
                                                <option value="">
                                                    Sélectionnez une devise
                                                </option>

                                                {/* Liste des devises disponibles */}
                                                {currencies.length === 0 ? (
                                                    <option value="">
                                                        Aucune devise disponible
                                                    </option>
                                                ) : (
                                                    currencies.map(
                                                        (currency) => (
                                                            <option
                                                                key={
                                                                    currency.id
                                                                }
                                                                value={
                                                                    currency.id
                                                                }
                                                            >
                                                                {currency.name}{" "}
                                                                ({currency.code}
                                                                )
                                                            </option>
                                                        )
                                                    )
                                                )}
                                            </select>

                                            {/* Affichage des erreurs de validation */}
                                            {errors.currency && (
                                                <div className="text-red-500 mt-2">
                                                    {errors.currency}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Montant
                                            </label>
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Montant à déposer"
                                            />
                                            {errors.amount && (
                                                <div className="text-red-500">
                                                    {errors.amount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Affichage dynamique de la méthode de dépôt sélectionnée */}
                                        {selectedDepositMethod && (
                                            <div className="mt-6 p-4 border rounded-md bg-gray-50">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    Détails de la méthode de
                                                    dépôt
                                                </h3>
                                                <p className="mt-2 text-gray-600">
                                                    {
                                                        selectedDepositMethod.description
                                                    }
                                                </p>
                                                {selectedDepositMethod.fields && (
                                                    <ul className="mt-4 space-y-2">
                                                        {selectedDepositMethod.fields.map(
                                                            (field, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-gray-600 flex items-center"
                                                                >
                                                                    <span className="font-medium">
                                                                        {
                                                                            field.field_name
                                                                        }
                                                                        :
                                                                    </span>{" "}
                                                                    {field.field_name ===
                                                                    "Wallet Adresse" ? (
                                                                        <button
                                                                            type="button" // Assurez-vous que le type est "button" pour ne pas soumettre le formulaire
                                                                            onClick={(
                                                                                event
                                                                            ) =>
                                                                                handleCopy(
                                                                                    field.field_value,
                                                                                    event
                                                                                )
                                                                            }
                                                                            className="ml-2 text-indigo-600 underline hover:text-indigo-800"
                                                                        >
                                                                            {
                                                                                field.field_value
                                                                            }{" "}
                                                                            (Copier)
                                                                        </button>
                                                                    ) : (
                                                                        <span className="ml-2">
                                                                            {
                                                                                field.field_value
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {data.transactionType === "withdraw" && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Méthode de retrait
                                            </label>
                                            <select
                                                value={data.withdrawalMethod}
                                                onChange={
                                                    handleWithdrawalMethodChange
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="">
                                                    Choisissez une méthode de
                                                    retrait
                                                </option>
                                                {withdrawalMethods.map(
                                                    (method) => (
                                                        <option
                                                            key={method.id}
                                                            value={method.id}
                                                        >
                                                            {method.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            {errors.withdrawalMethod && (
                                                <div className="text-red-500">
                                                    {errors.withdrawalMethod}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                htmlFor="currency"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Devise :
                                            </label>
                                            <select
                                                id="currency"
                                                value={
                                                    selectedCurrency
                                                        ? selectedCurrency.id
                                                        : ""
                                                }
                                                onChange={handleCurrencyChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            >
                                                {/* Option par défaut pour sélectionner une devise */}
                                                <option value="">
                                                    Sélectionnez une devise
                                                </option>

                                                {/* Liste des devises disponibles */}
                                                {currencies.length === 0 ? (
                                                    <option value="">
                                                        Aucune devise disponible
                                                    </option>
                                                ) : (
                                                    currencies.map(
                                                        (currency) => (
                                                            <option
                                                                key={
                                                                    currency.id
                                                                }
                                                                value={
                                                                    currency.id
                                                                }
                                                            >
                                                                {currency.name}{" "}
                                                                ({currency.code}
                                                                )
                                                            </option>
                                                        )
                                                    )
                                                )}
                                            </select>
                                            {errors.currency && (
                                                <div className="text-red-500 mt-2">
                                                    {errors.currency}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Montant
                                            </label>
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) =>
                                                    setData(
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Montant à retirer"
                                            />
                                            {errors.amount && (
                                                <div className="text-red-500">
                                                    {errors.amount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Affichage de l'adresse du wallet en permanence */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                {data.withdrawalMethod === "1"
                                                    ? "Adresse du Wallet"
                                                    : "Numéro de Compte"}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.walletAddress}
                                                onChange={(e) =>
                                                    setData(
                                                        "walletAddress",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder={
                                                    data.withdrawalMethod ===
                                                    "1"
                                                        ? "Entrez l'adresse du wallet"
                                                        : "Entrez le numéro de compte"
                                                }
                                            />
                                            {errors.walletAddress && (
                                                <div className="text-red-500">
                                                    {errors.walletAddress}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Message supplémentaire pour toutes les méthodes */}
                                <p className="mt-6 text-center font-semibold text-sm">
                                    Contactez le support via{" "}
                                    <a
                                        href="https://t.me/IMARKET_Consulting"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#88ae75] underline hover:text-[#cd8b76]"
                                    >
                                        Telegram
                                    </a>{" "}
                                    pour toute assistance ou confirmer une
                                    transaction.
                                </p>

                                <div className="flex justify-between align-middle space-x-4">
                                    <Link
                                        href="/transactions"
                                        className="text-sm underline text-gray-600 hover:text-gray-900"
                                    >
                                        Annuler
                                    </Link>
                                    <PrimaryButton type="submit">
                                        Soumettre
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
