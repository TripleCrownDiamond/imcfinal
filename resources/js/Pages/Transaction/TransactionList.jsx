import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";
import PrimaryButton from "@/Components/PrimaryButton";
import { Inertia } from "@inertiajs/inertia";
import { mainCurrency } from "@/utils/constants";

export default function TransactionList({ transactions, isAdmin, auth, user }) {
    const { flash } = usePage().props;
    const { post } = useForm();
    const mainCurrencyName = mainCurrency.name;
    const csrfToken = document.head.querySelector(
        'meta[name="csrf-token"]'
    ).content;

    const [data, setData] = useState(transactions.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const getStatusClass = (status) =>
        (status === "confirmed" && "bg-green-200 text-green-800") ||
        (status === "pending" && "bg-yellow-200 text-yellow-800") ||
        (status === "canceled" && "bg-red-200 text-red-800") ||
        "bg-gray-200 text-gray-800";

    const getTransactionType = (transaction) =>
        transaction.type === "transfer"
            ? transaction.user_id === user.id
                ? "Transfert sortant"
                : "Transfert entrant"
            : transaction.type === "deposit"
            ? "Dépôt"
            : "Retrait";

    const handleAction = (e, transactionId, action) => {
        e.preventDefault();

        const confirmMessage =
            action === "confirm"
                ? "Êtes-vous sûr de vouloir confirmer cette transaction ?"
                : "Êtes-vous sûr de vouloir annuler cette transaction ?";

        if (window.confirm(confirmMessage)) {
            post(`/transactions/${transactionId}/${action}`, {
                onSuccess: () => {
                    // Dynamically set the success message based on the action
                    const successMessage =
                        action === "confirm"
                            ? "Transaction confirmée avec succès !"
                            : "Transaction annulée avec succès !";

                    toast.success(successMessage); // Show the dynamic success message

                    // Redirect or refresh the page using Inertia
                    Inertia.visit(window.location.href, {
                        method: "get",
                        preserveState: true,
                    });
                },
                onError: (errors) => {
                    toast.error("Erreur lors de l'action !");
                    console.error(errors);
                },
            });
        }
    };

    const loadPage = (page) => {
        setLoading(true);

        Inertia.get(
            `/transactions?page=${page}`,
            {},
            {
                onSuccess: (response) => {
                    const result = response.props.transactions;
                    setData(result.data);
                    setCurrentPage(page);
                },
                onError: () => {
                    toast.error("Erreur lors du chargement des transactions.");
                },
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Liste des Transactions
                </h2>
            }
        >
            <Head title="Transactions" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4 gap-4">
                        <PrimaryButton>
                            <Link href="/transactions/create">
                                Faire une transaction
                            </Link>
                        </PrimaryButton>
                        {isAdmin && (
                            <Link
                                href="/deposit-methods"
                                className="text-blue-600 hover:underline text-sm sm:text-base font-medium"
                            >
                                Modifier les méthodes de paiement
                            </Link>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {data.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    Aucune transaction trouvée.
                                </p>
                            ) : (
                                <ul>
                                    {data.map((transaction) => (
                                        <li
                                            key={transaction.id}
                                            className="border-b border-gray-300 py-4 hover:bg-gray-100 transition duration-200"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <h3 className="text-lg font-semibold text-[#cd8b76]">
                                                        {getTransactionType(
                                                            transaction
                                                        )}
                                                    </h3>
                                                    <p className="text-gray-700">
                                                        Montant:{" "}
                                                        <strong className="text-[#82b170]">
                                                            {transaction.amount}{" "}
                                                            {mainCurrencyName}
                                                        </strong>
                                                    </p>
                                                    {transaction.type ===
                                                        "transfer" && (
                                                        <p className="text-gray-500">
                                                            {transaction.user_id ===
                                                            user.id
                                                                ? `Destinataire: ${transaction.receiver_username}`
                                                                : `Expéditeur: ${transaction.sender_username}`}
                                                        </p>
                                                    )}

                                                    {isAdmin &&
                                                        transaction.type !==
                                                            "transfer" && (
                                                            <p className="text-gray-500">
                                                                Initiateur:{" "}
                                                                <strong>
                                                                    {
                                                                        transaction.sender_username
                                                                    }
                                                                </strong>
                                                            </p>
                                                        )}

                                                    {transaction.type ===
                                                        "deposit" && (
                                                        <p className="text-gray-500">
                                                            Méthode de dépot:{" "}
                                                            <strong>
                                                                {
                                                                    transaction
                                                                        .deposit_method
                                                                        .name
                                                                }
                                                            </strong>
                                                        </p>
                                                    )}

                                                    {transaction.type ===
                                                        "withdraw" && (
                                                        <p className="text-gray-500">
                                                            <span>
                                                                Méthode de
                                                                retrait:{" "}
                                                                <strong>
                                                                    {" "}
                                                                    {
                                                                        transaction
                                                                            .withdrawal_method
                                                                            .name
                                                                    }
                                                                </strong>
                                                            </span>
                                                            <span className="flex items-center gap-2 mt-2">
                                                                Numéro/Wallet:{" "}
                                                                <span
                                                                    className="truncate max-w-xs text-gray-800 cursor-pointer underline hover:text-blue-600"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(
                                                                            transaction
                                                                                .transaction_wallet
                                                                                .account_or_wallet
                                                                        );
                                                                        toast.success(
                                                                            "Adresse copiée dans le presse-papiers !"
                                                                        );
                                                                    }}
                                                                    title={
                                                                        transaction
                                                                            .transaction_wallet
                                                                            .account_or_wallet
                                                                    } // Afficher l'intégralité au survol
                                                                >
                                                                    {
                                                                        transaction
                                                                            .transaction_wallet
                                                                            .account_or_wallet
                                                                    }
                                                                </span>
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                                    <p
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                            transaction.status
                                                        )}`}
                                                    >
                                                        {transaction.status}
                                                    </p>
                                                    <span className="text-sm text-gray-500">
                                                        Ajouté{" "}
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                transaction.created_at
                                                            ),
                                                            {
                                                                addSuffix: true,
                                                                locale: fr,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {isAdmin &&
                                                transaction.status ===
                                                    "pending" && (
                                                    <div className="mt-4 flex gap-4">
                                                        <PrimaryButton
                                                            onClick={(e) =>
                                                                handleAction(
                                                                    e,
                                                                    transaction.id,
                                                                    "confirm"
                                                                )
                                                            }
                                                        >
                                                            Confirmer
                                                        </PrimaryButton>
                                                        <PrimaryButton
                                                            onClick={(e) =>
                                                                handleAction(
                                                                    e,
                                                                    transaction.id,
                                                                    "cancel"
                                                                )
                                                            }
                                                            className="bg-red-600 hover:bg-red-800"
                                                        >
                                                            Annuler
                                                        </PrimaryButton>
                                                    </div>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <PrimaryButton
                            onClick={() => loadPage(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                        >
                            {loading ? "Chargement..." : "Précédent"}
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => loadPage(currentPage + 1)}
                            disabled={!transactions.next_page_url || loading}
                        >
                            {loading ? "Chargement..." : "Suivant"}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
