import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrashAlt, FaDollarSign } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";
import { mainCurrency } from "@/utils/constants";

export default function BotList({ bots, userRole, subscriptions }) {
    const { flash } = usePage().props;
    const { post } = useForm(); // Utilisation de useForm pour l'appel POST
    const mainCurrencyName = mainCurrency.name;
    useEffect(() => {
      
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    

    const handlePaySubscribers = () => {
        if (!window.confirm("Êtes-vous sûr de vouloir payer les souscripteurs ?")) {
            return; // Annuler si l'utilisateur refuse
        }
    
        post(
            "/calculate-daily-profits",
            {}, // Aucune donnée supplémentaire
            {
                onSuccess: () => {
                    console.log("Action réussie !");
                    // Les messages flash seront automatiquement pris en charge via le hook useEffect
                },
                onError: (errors) => {
                    console.error("Erreur :", errors);
                },
            }
        );
    };
    

    const handleDelete = async (botId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce bot ?")) {
            // Utilisation d'Inertia pour effectuer une requête DELETE
            Inertia.delete(`/bots/${botId}`, {
                onSuccess: () => {
                    toast.success("Bot supprimé avec succès !");
                },
                onError: () => {
                    toast.error("Erreur lors de la suppression du bot !");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Bots de Trading
                </h2>
            }
        >
            <Head title="Bots de Trading" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {userRole === "admin" && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <Link href="/bots/create">
                                    <PrimaryButton>
                                        <FaPlus className="mr-2" /> Ajouter un
                                        bot
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {/* Ajout du bouton pour payer les souscripteurs */}
                            <div className="flex justify-end mb-4">
                                <PrimaryButton onClick={handlePaySubscribers}>
                                    <FaDollarSign className="mr-2" />
                                    Payer les souscripteurs
                                </PrimaryButton>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <ul>
                                {bots.map((bot) => {
                                    const isSubscribed = subscriptions.includes(
                                        bot.id
                                    );
                                    return (
                                        <li
                                            key={bot.id}
                                            className="border-b border-gray-300 py-4 hover:bg-gray-100 transition duration-200"
                                        >
                                            <h3 className="text-lg font-semibold text-[#cd8b76]">
                                                {bot.name}
                                            </h3>
                                            <p className="text-gray-700">
                                                {bot.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-gray-500">
                                                    Durée:{" "}
                                                    <strong>
                                                        {bot.duration_days}{" "}
                                                        jours
                                                    </strong>
                                                </span>
                                                <div className="flex space-x-2">
                                                    <span className="text-sm text-black">
                                                        Prix en USD:{" "}
                                                        <strong className="text-xl font-bold text-[#82b170]">
                                                            ${bot.cost_usd}
                                                        </strong>{" "}
                                                        USD
                                                    </span>
                                                    <span>|</span>
                                                    <span className="text-sm text-black">
                                                        Prix en{" "}
                                                        {mainCurrencyName}:{" "}
                                                        <strong className="text-xl font-bold text-[#82b170]">
                                                            {bot.cost_icoin}
                                                        </strong>{" "}
                                                        {mainCurrencyName}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p>
                                                    Dépôt minimum (USD):{" "}
                                                    <strong>
                                                        ${" "}
                                                        {
                                                            bot.minimum_deposit_usd
                                                        }
                                                    </strong>
                                                </p>
                                                <p>
                                                    Dépôt minimum (
                                                    {mainCurrencyName}):{" "}
                                                    <strong>
                                                        {
                                                            bot.minimum_deposit_icoin
                                                        }{" "}
                                                        {mainCurrencyName}
                                                    </strong>
                                                </p>
                                                <p>
                                                    Profit quotidien:{" "}
                                                    <strong>
                                                        {
                                                            bot.daily_profit_percentage
                                                        }
                                                        %
                                                    </strong>
                                                </p>
                                                <p>
                                                    Durée de profit:{" "}
                                                    <strong>
                                                        {
                                                            bot.profit_duration_days
                                                        }{" "}
                                                        jours
                                                    </strong>
                                                </p>
                                            </div>
                                            {new Date() -
                                                new Date(bot.created_at) <
                                                365 * 24 * 60 * 60 * 1000 && (
                                                <span className="text-sm text-gray-500">
                                                    Ajouté{" "}
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            bot.created_at
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: fr,
                                                        }
                                                    )}
                                                </span>
                                            )}

                                            <div className="mt-4 flex space-x-4">
                                                {userRole === "admin" ? (
                                                    <>
                                                        <Link
                                                            href={`/bots/${bot.id}/edit`} // Remplacer `bot.id` par l'ID du bot que vous souhaitez éditer
                                                            className="flex items-center space-x-1"
                                                        >
                                                            <FaEdit />
                                                            <span>Éditer</span>
                                                        </Link>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    bot.id
                                                                )
                                                            }
                                                            className="flex items-center space-x-1 text-red-600"
                                                        >
                                                            <FaTrashAlt />
                                                            <span>
                                                                Supprimer
                                                            </span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {isSubscribed ? (
                                                            <Link
                                                                href={`/bot/${bot.id}/trading`}
                                                            >
                                                                <SecondaryButton>
                                                                    Trading
                                                                </SecondaryButton>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`/checkout/bot/${bot.id}`}
                                                            >
                                                                <PrimaryButton>
                                                                    Souscrire à
                                                                    ce bot
                                                                </PrimaryButton>
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
