import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-hot-toast";

export default function Edit() {
    const { flash } = usePage().props; // Récupérer les messages flash
    const mainCurrencyName = import.meta.env.VITE_MAIN_CURRENCY_NAME || 'I-Coin';
    
    const { bot } = usePage().props; // Données du bot à éditer

    const { data, setData, put, reset, errors } = useForm({
        name: bot.name || "",
        cost_icoin: bot.cost_icoin || "",
        cost_usd: bot.cost_usd || "",
        duration_days: bot.duration_days || "",
        minimum_deposit_icoin: bot.minimum_deposit_icoin || "",
        minimum_deposit_usd: bot.minimum_deposit_usd || "",
        daily_profit_percentage: bot.daily_profit_percentage || "",
        profit_duration_days: bot.profit_duration_days || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/bots/${bot.id}`, {
            data,
            onSuccess: () => {
                toast.success("Bot mis à jour avec succès !");
                reset(); // Réinitialiser le formulaire
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Modifier le Bot de Trading</h2>}
        >
            <Head title="Modifier un TradingBot" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                {/* Nom du Bot */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="name">Nom du Bot</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                                </div>

                                {/* Prix en I-Coin */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="cost_icoin">Coût en {mainCurrencyName}</label>
                                    <input
                                        type="number"
                                        id="cost_icoin"
                                        value={data.cost_icoin}
                                        onChange={(e) => setData("cost_icoin", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.cost_icoin && <div className="text-red-500">{errors.cost_icoin}</div>}
                                </div>

                                {/* Prix en USD */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="cost_usd">Coût en USD</label>
                                    <input
                                        type="number"
                                        id="cost_usd"
                                        value={data.cost_usd}
                                        onChange={(e) => setData("cost_usd", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.cost_usd && <div className="text-red-500">{errors.cost_usd}</div>}
                                </div>

                                {/* Durée du Bot (en jours) */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="duration_days">Durée du Bot (en jours)</label>
                                    <input
                                        type="number"
                                        id="duration_days"
                                        value={data.duration_days}
                                        onChange={(e) => setData("duration_days", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.duration_days && <div className="text-red-500">{errors.duration_days}</div>}
                                </div>

                                {/* Dépôt minimum en I-Coin */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="minimum_deposit_icoin">Dépôt minimum en {mainCurrencyName}</label>
                                    <input
                                        type="number"
                                        id="minimum_deposit_icoin"
                                        value={data.minimum_deposit_icoin}
                                        onChange={(e) => setData("minimum_deposit_icoin", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.minimum_deposit_icoin && <div className="text-red-500">{errors.minimum_deposit_icoin}</div>}
                                </div>

                                {/* Dépôt minimum en USD */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="minimum_deposit_usd">Dépôt minimum en USD</label>
                                    <input
                                        type="number"
                                        id="minimum_deposit_usd"
                                        value={data.minimum_deposit_usd}
                                        onChange={(e) => setData("minimum_deposit_usd", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.minimum_deposit_usd && <div className="text-red-500">{errors.minimum_deposit_usd}</div>}
                                </div>

                                {/* Pourcentage de profit journalier */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="daily_profit_percentage">Pourcentage de profit journalier</label>
                                    <input
                                        type="number"
                                        id="daily_profit_percentage"
                                        value={data.daily_profit_percentage}
                                        onChange={(e) => setData("daily_profit_percentage", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.daily_profit_percentage && <div className="text-red-500">{errors.daily_profit_percentage}</div>}
                                </div>

                                {/* Durée du profit (en jours) */}
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="profit_duration_days">Durée du profit (en jours)</label>
                                    <input
                                        type="number"
                                        id="profit_duration_days"
                                        value={data.profit_duration_days}
                                        onChange={(e) => setData("profit_duration_days", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.profit_duration_days && <div className="text-red-500">{errors.profit_duration_days}</div>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link href="/trading-bots" className="text-gray-600 hover:text-gray-800 underline">
                                        Annuler
                                    </Link>
                                    <PrimaryButton type="submit">Mettre à jour le Bot</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
