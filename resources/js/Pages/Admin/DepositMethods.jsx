import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function DepositMethods({ depositMethods, isAdmin }) {
    const handleEditClick = (methodId) => {
        console.log(`Édition de la méthode avec l'ID : ${methodId}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Méthodes de Dépôt
                </h2>
            }
        >
            <Head title="Méthodes de Dépôt" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {depositMethods.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    Aucune méthode de dépôt disponible.
                                </p>
                            ) : (
                                <ul>
                                    {depositMethods.map((method) => (
                                        <li
                                            key={method.id}
                                            className="border-b border-gray-300 py-4 hover:bg-gray-100 transition duration-200"
                                        >
                                            <h3 className="text-lg font-semibold text-[#cd8b76]">
                                                {method.name}
                                            </h3>
                                            <p className="text-gray-700 mb-2">
                                                {method.description}
                                            </p>
                                            <ul className="ml-4">
                                                {method.fields.map((field) => (
                                                    <li
                                                        key={field.id}
                                                        className="text-sm text-gray-600"
                                                    >
                                                        <strong>
                                                            {field.field_name}
                                                        </strong>{" "}
                                                        : {field.field_value}
                                                    </li>
                                                ))}
                                            </ul>
                                            {isAdmin && (
                                                <div className="mt-4">
                                                    <PrimaryButton
                                                        onClick={() =>
                                                            handleEditClick(method.id)
                                                        }
                                                    >
                                                        <Link
                                                            href={`/deposit-methods/${method.id}/edit`}
                                                            onClick={(e) =>
                                                                console.log(
                                                                    `Lien cliqué pour méthode ID : ${method.id}`
                                                                )
                                                            }
                                                        >
                                                            Éditer
                                                        </Link>
                                                    </PrimaryButton>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
