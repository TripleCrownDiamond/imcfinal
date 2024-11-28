import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";
import PrimaryButton from "@/Components/PrimaryButton";
import { mainCurrency } from "@/utils/constants";
import { Inertia } from "@inertiajs/inertia";

export default function Show({
    user,
    formations,
    bots,
    activeSubscriptions,
    activeFormationSubscriptions,
    kyc,

}) {
    const { post, processing } = useForm();
    const mainCurrencyName = mainCurrency.name;
    const [loading, setLoading] = useState(false);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleKycValidation = (documentId, status) => {
        setLoading(true);
        post(
            route("kyc.validate", {
                documentId: documentId,
                status: status,
            }),
            {
                onSuccess: () => {
                    toast.success(`Le statut KYC a été ${status === "verified" ? "vérifié" : "rejeté"} avec succès !`);
                },
                onError: () => {
                    toast.error("Erreur lors de la souscription.");
                },
                onFinish: () => setLoading(false),
            }
        );
        
    };
     
    
    const handleSubscribeToFormation = (formationId) => {
        if (!user || !user.id) {
            toast.error("Utilisateur non valide.");
            return;
        }

        if (
            window.confirm(
                `Êtes-vous sûr de vouloir activer cette formation pour ${user.username} ?`
            )
        ) {
            setLoading(true);
            post(
                route("user.subscribe.formation", {
                    user_id: user.id, // Envoi de user_id uniquement
                    formation_id: formationId,
                }),
                {
                    onSuccess: () => {
                        toast.success("Souscription à la formation réussie.");
                    },
                    onError: () => {
                        toast.error("Erreur lors de la souscription.");
                    },
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    const handleSubscribeToBot = (botId, duration) => {
        if (
            window.confirm(
                `Êtes-vous sûr de vouloir souscrire à ce bot pour ${user.username} ?`
            )
        ) {
            setLoading(true);
            post(
                route("user.subscribe.bot", {
                    user: user.id,
                    bot_id: botId,
                    duration_days: duration,
                }), // Passer uniquement l'ID de l'utilisateur
                {
                    onSuccess: () => {
                        toast.success("Souscription au bot réussie.");
                    },
                    onError: () => {
                        toast.error("Erreur lors de la souscription.");
                    },
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    const handleUnsubscribeFromFormation = (formationId) => {
        if (
            window.confirm(
                `Êtes-vous sûr de vouloir annuler la souscription de ${user.username} à cette formation ?`
            )
        ) {
            setLoading(true);
            post(
                route("user.unsubscribe.formation", {
                    user: user.id, // L'ID de l'utilisateur
                    formationId: formationId, // L'ID de la formation
                }),
                {
                    onSuccess: () => {
                        toast.success("Souscription à la formation annulée.");
                    },
                    onError: () => {
                        toast.error(
                            "Erreur lors de l'annulation de la souscription."
                        );
                    },
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    const handleUnsubscribeFromBot = (botId) => {
        if (
            window.confirm(
                `Êtes-vous sûr de vouloir annuler la souscription de ${user.username} à ce bot ?`
            )
        ) {
            setLoading(true);
            post(
                route("user.unsubscribe.bot", {
                    user: user.id, // L'ID de l'utilisateur
                    botId: botId, // L'ID du bot
                }),
                {
                    onSuccess: () => {
                        toast.success("Souscription au bot annulée.");
                    },
                    onError: () => {
                        toast.error(
                            "Erreur lors de l'annulation de la souscription."
                        );
                    },
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    // Fonction pour copier un texte dans le presse-papiers
    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success("Texte copié avec succès !");
            })
            .catch(() => {
                toast.error("Échec de la copie");
            });
    };

    // Vérifie si l'utilisateur est déjà abonné à une formation
    const isSubscribedToFormation = (formationId) => {
        return user.formation_subscriptions.some(
            (subscription) => subscription.formation_id === formationId
        );
    };

    // Vérifie si l'utilisateur est abonné à un bot et si l'abonnement est toujours actif
    const isSubscribedToBot = (botId) => {
        return activeSubscriptions.some((subscription) => {
            // Log chaque souscription vérifiée

            return (
                subscription.bot_id === botId &&
                new Date(subscription.expiration_date) > new Date()
            );
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">{`${user.first_name} ${user.last_name}`}</h2>
            }
        >
            <Head title={`${user.first_name} ${user.last_name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Informations utilisateur
                            </h3>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">
                                Username:{" "}
                                <span
                                    onClick={() =>
                                        copyToClipboard(user.username)
                                    }
                                    className="text-blue-500 cursor-pointer hover:underline"
                                >
                                    {user.username}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Pays: {user.country?.name || "Non spécifié"}
                            </p>
                            <p className="text-gray-600">
                                Numéro de téléphone:{" "}
                                {user.phone_number || "Non spécifié"}
                            </p>
                            <p className="text-gray-600">
                                {user.sponsor
                                    ? `Sponsorisé par : ${user.sponsor.username}`
                                    : "Aucun sponsor"}
                            </p>
                            <p className="text-gray-600">
                                Balance:{" "}
                                <strong>
                                    {user.balance} {mainCurrencyName}
                                </strong>
                            </p>
                            <p className="text-gray-600">
                                Mot de passe:{" "}
                                <span
                                    onClick={() =>
                                        copyToClipboard(user.visible_password)
                                    }
                                    className="text-blue-500 cursor-pointer hover:underline"
                                >
                                    {user.visible_password}
                                </span>
                            </p>

                            <hr className="my-6 border-gray-300" />

                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                Distinctions
                            </h3>
                            {user.distinctions?.length > 0 ? (
                                <ul>
                                    {user.distinctions.map((distinction) => (
                                        <li
                                            key={distinction.id}
                                            className="text-gray-600"
                                        >
                                            {distinction.name} - Acquis le:{" "}
                                            {distinction.pivot.date_acquired}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">
                                    Aucune distinction
                                </p>
                            )}

                            <hr className="my-6 border-gray-300" />

                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                Abonnements aux Bots Actifs
                            </h3>
                            {activeSubscriptions.length > 0 ? (
                                <ul className="space-y-4">
                                    {activeSubscriptions.map((subscription) => {
                                        // Log de chaque abonnement

                                        return (
                                            <li
                                                key={subscription.id}
                                                className="p-4 border rounded-lg shadow-sm bg-gray-50"
                                            >
                                                <div className="flex flex-col md:flex-row md:justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            {subscription.bot
                                                                ?.name ||
                                                                "Bot inconnu"}
                                                        </h4>

                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Expiration :{" "}
                                                            <span className="font-medium">
                                                                {new Date(
                                                                    subscription.expiration_date
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            handleUnsubscribeFromBot(
                                                                subscription.bot_id
                                                            );
                                                        }}
                                                        className="mt-4 md:mt-0 text-red-500 hover:underline"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">
                                    Aucun abonnement actif
                                </p>
                            )}

                            <hr className="my-6 border-gray-300" />

                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                Formations souscrites
                            </h3>

                            {user.formation_subscriptions?.length > 0 ? (
                                <ul className="space-y-4">
                                    {user.formation_subscriptions.map(
                                        (formationSubscription) => {
                                            // Log de chaque abonnement à une formation

                                            return (
                                                <li
                                                    key={
                                                        formationSubscription.id
                                                    }
                                                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                                                >
                                                    <div className="flex flex-col md:flex-row md:justify-between">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-gray-800">
                                                                {formationSubscription
                                                                    .formation
                                                                    ?.name ||
                                                                    "Formation inconnue"}
                                                            </h4>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                handleUnsubscribeFromFormation(
                                                                    formationSubscription.formation_id
                                                                );
                                                            }}
                                                            className="mt-4 md:mt-0 text-red-500 hover:underline"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-600">
                                    Aucune formation souscrite
                                </p>
                            )}

                            <hr className="my-6 border-gray-300" />

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Formations disponibles
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {formations.map((formation) => (
                                        <div
                                            key={formation.id}
                                            className="border p-4 rounded-lg"
                                        >
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {formation.name}
                                            </h4>
                                            <p className="text-gray-600">
                                                {formation.details}
                                            </p>
                                            <PrimaryButton
                                                onClick={() =>
                                                    handleSubscribeToFormation(
                                                        formation.id
                                                    )
                                                }
                                                disabled={
                                                    isSubscribedToFormation(
                                                        formation.id
                                                    ) || loading
                                                }
                                            >
                                                {isSubscribedToFormation(
                                                    formation.id
                                                )
                                                    ? "Déjà activé"
                                                    : "Activer"}
                                            </PrimaryButton>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-6 border-gray-300" />

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Bots disponibles
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {bots.map((bot) => (
                                        <div
                                            key={bot.id}
                                            className="border p-4 rounded-lg"
                                        >
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {bot.name}
                                            </h4>
                                            <p className="text-gray-600">
                                                {bot.details}
                                            </p>
                                            <PrimaryButton
                                                onClick={() =>
                                                    handleSubscribeToBot(
                                                        bot.id,
                                                        bot.profit_duration_days
                                                    )
                                                }
                                                disabled={
                                                    isSubscribedToBot(bot.id) ||
                                                    loading
                                                }
                                            >
                                                {isSubscribedToBot(bot.id)
                                                    ? "Déjà souscrit"
                                                    : "Souscrire"}
                                            </PrimaryButton>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <section>
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    Vérification KYC
                                </h3>
                                <div className="mt-4 border p-4 rounded-lg bg-gray-50">
                                    {kyc.length === 0 ? (
                                        <p className="text-gray-600">
                                            Aucun document KYC soumis.
                                        </p>
                                    ) : (
                                        kyc.map((document) => (
                                            <div
                                                key={document.id}
                                                className="flex items-center justify-between mb-4"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-gray-600">
                                                        {document.document_type ===
                                                        "identity_verification"
                                                            ? "Vérification d'identité"
                                                            : "Vérification d'adresse"}{" "}
                                                        :{" "}
                                                        <span className="font-medium">
                                                            {document.status ===
                                                            "pending"
                                                                ? "En attente"
                                                                : document.status ===
                                                                  "verified"
                                                                ? "Validé"
                                                                : "Rejeté"}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Document KYC:{" "}
                                                        <a
                                                            href={`/storage/${document.document_path}`}
                                                            target="_blank"
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Voir le document
                                                        </a>
                                                    </p>
                                                </div>

                                                {/* Affichage des boutons uniquement si le statut est "pending" */}
                                                {document.status ===
                                                    "pending" && (
                                                    <div className="flex space-x-4">
                                                        <PrimaryButton
                                                            onClick={() =>
                                                                handleKycValidation(
                                                                    document.id,
                                                                    "verified"
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            Valider
                                                        </PrimaryButton>
                                                        <PrimaryButton
                                                            onClick={() =>
                                                                handleKycValidation(
                                                                    document.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                            disabled={loading}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            Rejeter
                                                        </PrimaryButton>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <hr className="my-6 border-gray-300" />
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
