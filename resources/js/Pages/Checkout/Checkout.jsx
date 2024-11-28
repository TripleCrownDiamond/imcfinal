import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export default function Checkout({ product, paymentMethods, productType }) {
    const { auth } = usePage().props;
    const { flash } = usePage().props; // Récupérer les messages flash
    const mainCurrencyName =
        import.meta.env.VITE_MAIN_CURRENCY_NAME || "I-Coin";

    const { message, error } = flash || {}; // Récupérer success et error

    useEffect(() => {
        if (message) {
            toast.success(message);
        }

        if (error) {
            toast.error(error);
        }
    }, [flash]);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [billingDetails, setBillingDetails] = useState({
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
        username: auth.user.username || "",
        email: auth.user.email || "",
        country: auth.user.country?.name || "", // Pré-rempli avec le pays de l'utilisateur
        city: "",
        address: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);

    // Vérifier la validité du formulaire et l'état du bouton
    useEffect(() => {
        const isFilled =
            billingDetails.first_name &&
            billingDetails.last_name &&
            billingDetails.username &&
            billingDetails.email &&
            billingDetails.country &&
            billingDetails.city &&
            billingDetails.address &&
            selectedPaymentMethod;
        setIsFormValid(isFilled);
    }, [billingDetails, selectedPaymentMethod]);

    const handleCheckout = (productId) => {
        const checkoutData = {
            productType,
            productId,
            paymentMethod: String(selectedPaymentMethod), // Force le type string
            billingDetails,
        };
        router.post("/checkout/process", checkoutData, {
            onSuccess: (response) => {
                if (response.props.flash?.success) {
                    toast.success(response.props.flash.success);

                    // Ajouter un petit délai avant d'afficher le toast de redirection
                    setTimeout(() => {
                        toast("Redirection en cours...");

                        // Redirection après le second toast
                        setTimeout(() => {
                            // Redirection en fonction du type de produit
                            if (productType === "course") {
                                window.location.href = route("courses.index");
                            } else if (productType === "bot") {
                                window.location.href = route("bots.index");
                            }
                        }, 1500);
                    }, 1000);
                }
            },
            onError: (errors) => {
                if (errors && errors.flash?.error) {
                    toast.error(errors.flash.error);
                } else {
                    Object.values(errors).forEach((error) => {
                        toast.error(error);
                    });
                }
            },
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails({ ...billingDetails, [name]: value });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Checkout
                </h2>
            }
        >
            <Head title="Checkout" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Section Détails du Produit */}
                        <div className="border-b border-gray-300 pb-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Détails du Produit
                            </h3>
                            <p className="text-gray-700 mt-2">{product.name}</p>
                            <p className="text-gray-700 mt-2">
                                {product.description}
                            </p>
                            <div className="flex space-x-4 items-center mt-4">
                                <span className="text-sm text-black">
                                    Prix en dollars:{" "}
                                    <strong className="text-xl font-bold text-[#82b170]">
                                        ${product.price_usd}
                                    </strong>
                                </span>
                                <span>|</span>
                                <span className="text-sm text-black">
                                    Prix en {mainCurrencyName}:{" "}
                                    <strong className="text-xl font-bold text-[#82b170]">
                                        {product.price_i_coin}
                                    </strong>{" "}
                                    {mainCurrencyName}
                                </span>
                            </div>
                        </div>

                        {/* Affichage des détails spécifiques au produit type */}

                        {productType === "bot" && (
                            <div className="border-b border-gray-300 pb-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Détails du Bot
                                </h3>
                                <p className="text-gray-700 mt-2">
                                    Taux de profit quotidien:{" "}
                                    <strong className="text-[#82b170]">
                                        {product.daily_profit_percentage}%
                                    </strong>
                                </p>
                                <p className="text-gray-700 mt-2">
                                    Durée du profit:{" "}
                                    <strong className="text-[#82b170]">
                                        {product.profit_duration_days} jours
                                    </strong>
                                </p>
                                <p className="text-gray-700 mt-2">
                                    Dépôt minimum en USD:{" "}
                                    <strong className="text-[#82b170]">
                                        ${product.minimum_deposit_usd}
                                    </strong>
                                </p>
                                <p className="text-gray-700 mt-2">
                                    Dépôt minimum en {mainCurrencyName}:{" "}
                                    <strong className="text-[#82b170]">
                                        {product.minimum_deposit_icoin}{" "}
                                        {mainCurrencyName}
                                    </strong>
                                </p>
                            </div>
                        )}

                        {/* Section Détails de Facturation */}
                        {/* Section Détails de Facturation */}
                        <div className="border-b border-gray-300 pb-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Détails de Facturation
                            </h3>
                            <form className="space-y-4 mt-4">
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={billingDetails.first_name}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">Nom</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={billingDetails.last_name}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={billingDetails.username}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={billingDetails.email}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={billingDetails.country}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={billingDetails.city}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-600">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={billingDetails.address}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded"
                                        required
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Section Méthode de Paiement */}
                        <div className="border-b border-gray-300 pb-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Méthode de Paiement
                            </h3>
                            <div className="mt-4 space-y-2">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            id={`payment-method-${method.id}`}
                                            name="payment_method"
                                            value={method.id}
                                            onChange={() =>
                                                setSelectedPaymentMethod(
                                                    method.id
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        <label
                                            htmlFor={`payment-method-${method.id}`}
                                            className="flex items-center space-x-2"
                                        >
                                            <span className="text-gray-700">
                                                {method.name} -{" "}
                                                {method.description}
                                            </span>
                                            <span
                                                className={`p-1 px-2 rounded-full text-xs ${
                                                    method.is_active
                                                        ? "bg-green-200"
                                                        : "bg-red-200"
                                                }`}
                                            >
                                                {method.is_active
                                                    ? "Actif"
                                                    : "Inactif"}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between align-middle space-x-4">
                            <Link
                                href={
                                    productType === "bot" ? "/bots" : "/courses"
                                }
                                className="text-sm underline text-gray-600 hover:text-gray-900"
                            >
                                Annuler
                            </Link>

                            <PrimaryButton
                                onClick={() => handleCheckout(product.id)}
                                disabled={!isFormValid}
                            >
                                Payer
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
