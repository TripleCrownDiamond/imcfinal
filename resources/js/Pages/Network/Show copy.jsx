import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-hot-toast";
import { Inertia } from "@inertiajs/inertia";
import { mainCurrency } from "@/utils/constants";
import { format } from "date-fns";

// Fonction pour déterminer les classes de couleur en fonction de la distinction
const getDistinctionStyles = (distinction) => {
    switch (distinction) {
        case "Gold":
            return "bg-yellow-100 text-yellow-800 border-yellow-400";
        case "Silver":
            return "bg-gray-200 text-gray-700 border-gray-400";
        case "Bronze":
            return "bg-orange-200 text-orange-800 border-orange-400";
        default:
            return "bg-gray-100 text-gray-600 border-gray-300";
    }
};

// Composant récursif pour afficher chaque downline et ses sous-downlines
const DownlineTree = ({ user, level = 0 }) => (
    <div className="ml-4 border-l pl-4">
        <div className="mb-2">
            <span
                className={`text-lg font-semibold ${
                    level === 0 ? "text-[#cd8b76]" : "text-gray-700"
                }`}
            >
                {user.username}
            </span>
            <div className="text-sm text-gray-500 mt-1">
                Distinction :{" "}
                {user.distinction !== "Aucune distinction" ? (
                    <span
                        className={`inline-block px-2 py-1 rounded ${getDistinctionStyles(
                            user.distinction
                        )}`}
                    >
                        {user.distinction}
                    </span>
                ) : (
                    <span>Aucune distinction</span>
                )}
            </div>
        </div>

        {/* Affiche les sous-downlines de manière récursive */}
        {user.downlines && user.downlines.length > 0 ? (
            user.downlines.map((downline) => {
                // Log the downline content for debugging
                console.log("Downline:", downline);

                return (
                    <DownlineTree
                        key={downline.id || `${level}-${downline.username}`}
                        user={downline}
                        level={level + 1}
                    />
                );
            })
        ) : (
            <span>Aucune downline</span>
        )}
    </div>
);

export default function NetworkShow({
    user,
    downlines,
    nextDistinction,
    isEligible,
    flash,
    userDistinctions,
    sponsorGains,
}) {
    const [eligible, setEligible] = useState(isEligible);

    console.log(`User: ${user.username}`);

    const { post, processing, errors } = useForm();

    const handleVerifyEligibility = (userId) => {
        post(`/network/verify-distinction/${userId}`, {
            onSuccess: () => {
                toast.success("Distinction mise à jour avec succès !");
                // Recharger la page après le succès de la mise à jour
                Inertia.visit(window.location.href);
            },
            onError: (error) => {
                toast.error(error || "Une erreur est survenue.");
            },
        });
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout>
            <Head title={`Network - ${user.username}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold mb-4 text-[#cd8b76]">
                            Réseau de {user.username}
                        </h1>
                        <p className="text-gray-700">
                            Voici l'arbre généalogique de votre réseau :
                        </p>

                        {/* Affichage de la distinction actuelle */}
                        {user.role !== "admin" && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-[#82b170]">
                                    Distinction actuelle
                                </h2>
                                {userDistinctions &&
                                userDistinctions.length > 0 ? (
                                    <div>
                                        <p>
                                            Distinction actuelle :{" "}
                                            <span
                                                className={`inline-block px-2 py-1 rounded ${getDistinctionStyles(
                                                    userDistinctions[0].name // Affiche la première distinction triée
                                                )}`}
                                            >
                                                {userDistinctions[0].name}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p>Aucune distinction actuelle.</p>
                                )}

                                {/* Affichage de la prochaine distinction et de l'éligibilité */}
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold text-[#82b170]">
                                        Prochaine Distinction
                                    </h2>
                                    {nextDistinction ? (
                                        <div>
                                            <p>
                                                Prochaine distinction :{" "}
                                                <span
                                                    className={`inline-block px-2 py-1 rounded ${getDistinctionStyles(
                                                        nextDistinction.name
                                                    )}`}
                                                >
                                                    {nextDistinction.name}
                                                </span>
                                            </p>

                                            <p
                                                className={`text-${
                                                    eligible ? "green" : "red"
                                                }-600`}
                                            >
                                                {eligible
                                                    ? "Éligible"
                                                    : "Non éligible"}
                                            </p>
                                            <PrimaryButton
                                                onClick={() =>
                                                    handleVerifyEligibility(
                                                        user.id
                                                    )
                                                }
                                                disabled={!eligible}
                                            >
                                                Upgrade
                                            </PrimaryButton>
                                        </div>
                                    ) : (
                                        <p>Aucune distinction disponible.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Affichage de l'arbre généalogique */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-[#82b170]">
                                Généalogie
                            </h2>

                            {/* Utilisation du composant récursif pour l'affichage en arbre */}
                            {downlines && downlines.length > 0 ? (
                                downlines.map((downline) => (
                                    <DownlineTree
                                        key={downline.id}
                                        user={downline}
                                    />
                                ))
                            ) : (
                                <p>Aucune downline disponible</p>
                            )}
                        </div>

                        {/* Affichage des gains */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-[#82b170]">
                                Gains
                            </h2>
                            {sponsorGains &&
                            sponsorGains.data &&
                            sponsorGains.data.length > 0 ? (
                                <>
                                    <table className="min-w-full mt-4 table-auto">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 px-4 text-left">
                                                    Montant des gains
                                                </th>
                                                <th className="py-2 px-4 text-left">
                                                    Nom du filleul
                                                </th>
                                                <th className="py-2 px-4 text-left">
                                                    Date du gain
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sponsorGains.data.map((gain) => (
                                                <tr
                                                    key={gain.id}
                                                    className="border-b"
                                                >
                                                    <td className="py-2 px-4">
                                                        {gain.gain_amount}{" "}
                                                        {mainCurrency.name}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        {gain.buyer.username}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        {/* Humanisation de la date */}
                                                        {format(
                                                            new Date(
                                                                gain.created_at
                                                            ),
                                                            "dd MMM yyyy, HH:mm"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    <div className="mt-4 flex justify-between">
                                        {/* Précédent */}
                                        {sponsorGains.prev_page_url && (
                                            <a
                                                href={
                                                    sponsorGains.prev_page_url
                                                }
                                                className="px-4 py-2 bg-gray-300 text-black rounded-md"
                                            >
                                                Précédent
                                            </a>
                                        )}

                                        {/* Suivant */}
                                        {sponsorGains.next_page_url && (
                                            <a
                                                href={
                                                    sponsorGains.next_page_url
                                                }
                                                className="px-4 py-2 bg-gray-300 text-black rounded-md"
                                            >
                                                Suivant
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p>Aucun gain disponible</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
