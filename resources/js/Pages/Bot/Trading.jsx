import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import toast from "react-hot-toast";
import { mainCurrency } from "@/utils/constants";

export default function Trading({
    bot,
    minimum_deposit,
    isActiveSubscription,
    subscription_id,
    tradingDeposits,
    role, // Ajout du rôle de l'utilisateur
}) {
    const mainCurrencyName = mainCurrency.name;

    const { flash } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        amount: minimum_deposit,
    });

    // Afficher le message flash si présent
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("trading.deposit", { id: subscription_id }), {
            data: { amount: data.amount },
            onSuccess: (response) => {
                console.log("Réponse du serveur (Succès) :", response);
                // Le succès sera capté par le backend avec une réponse JSON
                if (response.success) {
                    toast.success(response.success); // Affiche le message de succès
                }
                reset();
            },
            onError: (errors) => {
                console.error("Réponse du serveur (Erreur) :", errors);
                // Vérification si un message d'erreur est envoyé par le backend
                if (errors.error) {
                    toast.error(errors.error); // Affiche l'erreur envoyée par le backend
                } else {
                    toast.error("Une erreur est survenue lors du dépôt.");
                }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Trading - ${bot.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-[#cd8b76]">
                            {bot.name}
                        </h1>
                        <p className="text-gray-700">{bot.description}</p>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-[#82b170]">
                                Détails du Trading
                            </h2>
                            <p>
                                Profit quotidien: {bot.daily_profit_percentage}%
                            </p>
                            <p>
                                Durée de profit: {bot.profit_duration_days}{" "}
                                jours
                            </p>
                        </div>

                        {isActiveSubscription || role === "admin" ? (
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold">
                                    Dépôt minimum requis : {minimum_deposit}{" "}
                                    {mainCurrencyName}
                                </h2>
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Montant du dépôt (en {mainCurrencyName})
                                    </label>
                                    <input
                                        type="number"
                                        min={minimum_deposit}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder={`Minimum ${minimum_deposit}`}
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                    />
                                    <div className="flex justify-between mt-4">
                                        <Link
                                            href="/bots"
                                            className="text-sm text-gray-500 hover:underline"
                                        >
                                            Annuler
                                        </Link>
                                        <PrimaryButton disabled={processing}>
                                            Déposer
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <p className="mt-4 text-red-500">
                                Votre abonnement a expiré. Veuillez renouveler
                                votre abonnement pour continuer.
                            </p>
                        )}

                        {/* Affichage des gains liés aux dépôts */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-[#82b170]">
                                Gains liés aux dépôts
                            </h3>
                            {tradingDeposits.data.length > 0 ? (
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left">
                                                Uniq ID
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Montant du Dépôt
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Total des Gains
                                            </th>
                                            <th className="px-4 py-2 text-left">
                                                Détails des Gains
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tradingDeposits.data.map((deposit) => {
                                            const totalGains =
                                                deposit.gains.reduce(
                                                    (sum, gain) =>
                                                        sum +
                                                        parseFloat(
                                                            gain.gain_amount
                                                        ),
                                                    0
                                                );

                                            return (
                                                <tr
                                                    key={deposit.id}
                                                    className="border-b"
                                                >
                                                    <td className="px-4 py-2">
                                                        {deposit.uniq_id.slice(
                                                            0,
                                                            8
                                                        ) + "..."}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {deposit.amount}{" "}
                                                        {mainCurrencyName}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {totalGains}{" "}
                                                        {mainCurrencyName}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <ul>
                                                            {deposit.gains.map(
                                                                (gain) => (
                                                                    <li
                                                                        key={
                                                                            gain.id
                                                                        }
                                                                    >
                                                                        {
                                                                            gain.gain_amount
                                                                        }{" "}
                                                                        {
                                                                            mainCurrencyName
                                                                        }{" "}
                                                                        obtenu
                                                                        le{" "}
                                                                        {new Date(
                                                                            gain.created_at
                                                                        ).toLocaleString()}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Aucun dépôt trouvé.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
