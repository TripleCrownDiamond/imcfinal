import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditDepositMethod({ depositMethod }) {
    const { flash } = usePage().props; 
    const { data, setData, put, processing, errors } = useForm({
        name: depositMethod.name || "",
        description: depositMethod.description || "",
        fields: depositMethod.fields.map((field) => ({
            id: field.id,
            field_name: field.field_name,
            field_type: field.field_type,
            field_value: field.field_value,
        })),
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success); // Afficher le message de succès
        }
        if (flash?.error) {
            toast.error(flash.error); // Afficher le message d'erreur
        }
    }, [flash]); // Déclenche l'effet lorsque `flash` change

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("deposit-methods.update", depositMethod.id), {
            onSuccess: () => toast.success("Méthode mise à jour avec succès !"),
            onError: () => toast.error("Une erreur s'est produite lors de la mise à jour."),
        });
    };

    const handleFieldChange = (index, key, value) => {
        setData("fields", data.fields.map((field, i) =>
            i === index ? { ...field, [key]: value } : field
        ));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Éditer Méthode de Dépôt
                </h2>
            }
        >
            <Head title="Éditer Méthode de Dépôt" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nom */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData("description", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                                {/* Fields */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        Champs Associés
                                    </h3>
                                    {data.fields.map((field, index) => (
                                        <div key={field.id} className="space-y-2 mb-4">
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Nom du Champ
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.field_name}
                                                    onChange={(e) =>
                                                        handleFieldChange(index, "field_name", e.target.value)
                                                    }
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Type du Champ
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.field_type}
                                                    onChange={(e) =>
                                                        handleFieldChange(index, "field_type", e.target.value)
                                                    }
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Valeur
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.field_value}
                                                    onChange={(e) =>
                                                        handleFieldChange(index, "field_value", e.target.value)
                                                    }
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            {errors[`fields.${index}`] && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors[`fields.${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Boutons */}
                                <div className="flex justify-between items-center">
                                    <Link
                                        href="/deposit-methods"
                                        className="text-sm text-gray-500 underline hover:text-gray-700"
                                    >
                                        Annuler
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Mettre à jour
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
