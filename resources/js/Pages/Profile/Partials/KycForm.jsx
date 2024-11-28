import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, Link } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Inertia } from "@inertiajs/inertia";

export default function KYCForm({ kyc = [], className = "" }) {
    const {
        data,
        setData,
        errors,
        post,
        processing,
        delete: destroy,
    } = useForm({
        identity_verification: null,
        address_verification: null,
    });

    const [documentStatus, setDocumentStatus] = useState(
        kyc.reduce(
            (acc, doc) => ({ ...acc, [doc.document_type]: doc.status }),
            {}
        )
    );

    // Gérer le changement de fichier
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setData(name, files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("identity_verification", data.identity_verification);
        formData.append("address_verification", data.address_verification);

        post(route("profile.kyc.submit"), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Documents soumis avec succès.");
            },
            onError: () => {
                toast.error("Une erreur est survenue.");
            },
        });
    };

    const handleDelete = (user_id) => {
        console.log(user_id); // Vérifier si l'ID utilisateur est correct
    
        Inertia.delete(route("profile.kyc.delete", { user_id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Document supprimé avec succès.");
            },
            onError: () => {
                toast.error("Erreur lors de la suppression.");
            },
        });
    };
    

    const renderDocumentRow = (type, label) => {
        const status = documentStatus[type];
        const document = kyc.find((doc) => doc.document_type === type);

        if (status === "verified") {
            return (
                <tr key={type}>
                    <td>{label}</td>
                    <td>
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                            Validé
                        </span>
                    </td>
                    <td>
                        <a
                            href={`/storage/${document.document_path}`}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            Voir le fichier
                        </a>
                    </td>
                </tr>
            );
        }

        if (status === "pending") {
            return (
                <tr key={type}>
                    <td>{label}</td>
                    <td>
                        <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                            En attente
                        </span>
                    </td>
                    <td>
                        <a
                            href={document.document_path}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            Voir le fichier
                        </a>
                    </td>
                </tr>
            );
        }

        if (status === "rejected") {
            return (
                <>
                    <tr key={type}>
                        <td>{label}</td>
                        <td>
                            <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
                                Rejeté
                            </span>
                        </td>
                        <td>
                            <div className="flex items-center gap-2">
                                <a
                                    href={document.document_path}
                                    target="_blank"
                                    className="text-blue-600 hover:underline"
                                >
                                    Voir le fichier
                                </a>
                                <Link
                                    className="text-red-600 hover:underline"
                                    onClick={() => handleDelete(document.user_id)}
                                >
                                    Supprimer
                                </Link>
                            </div>
                        </td>
                    </tr>
                   
                </>
            );
        }

        // Afficher le formulaire si aucun document ou document supprimé
        return (
            <tr key={type}>
                <td>{label}</td>
                <td>
                    <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                        Non soumis
                    </span>
                </td>
                <td>
                    <input
                        type="file"
                        name={type}
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                    />
                </td>
            </tr>
        );
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Vérification KYC
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Soumettez vos documents pour la vérification de votre
                    compte.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderDocumentRow(
                            "identity_verification",
                            "Vérification d'identité"
                        )}
                        {renderDocumentRow(
                            "address_verification",
                            "Vérification d'adresse"
                        )}
                    </tbody>
                </table>

                {(!documentStatus.identity_verification ||
                    !documentStatus.address_verification) && (
                    <div className="flex items-center gap-4 mt-4">
                        <PrimaryButton disabled={processing}>
                            Soumettre les documents
                        </PrimaryButton>
                    </div>
                )}

                {errors.documents && (
                    <div className="mt-2 text-red-600 text-sm">
                        {errors.documents}
                    </div>
                )}
            </form>
        </section>
    );
}
