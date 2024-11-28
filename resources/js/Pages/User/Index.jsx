import React, { useEffect, useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Inertia } from "@inertiajs/inertia";
import { Link } from '@inertiajs/react';



export default function Index({ auth }) {
    const { post, processing } = useForm();
    const { flash } = usePage().props;
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const fetchUsers = (page) => {
        setLoading(true);
        fetch(`/api/users?page=${page}`)
            .then((response) => response.json())
            .then((data) => {
                setUsers(data.data);
                setMeta(data.meta);
            })
            .catch(() => {
                toast.error("Erreur lors du chargement des utilisateurs.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            setLoading(true);
            post(route("users.destroy", id), {
                onSuccess: () => {
                    toast.success("Utilisateur supprimé avec succès.");
                    fetchUsers(meta.current_page);
                },
                onError: () => {
                    toast.error("Une erreur s'est produite lors de la suppression.");
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        }
    };

    const handlePagination = (page) => {
        fetchUsers(page);
    };

    if (auth.user.role !== "admin") {
        return (
            <AuthenticatedLayout>
                <div className="py-12 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Accès interdit
                    </h1>
                    <p className="text-gray-600">
                        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
                    </p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Liste des utilisateurs</h2>}
        >
            <Head title="Liste des utilisateurs" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {loading ? (
                                <p className="text-center text-gray-500">Chargement...</p>
                            ) : users.length === 0 ? (
                                <p className="text-gray-500 text-center">Aucun utilisateur trouvé.</p>
                            ) : (
                                <>
                                    <ul>
                                        {users.map((user) => (
                                            <li
                                                key={user.id}
                                                className="flex justify-between items-center border-b py-4 hover:bg-gray-100 transition duration-200"
                                            >
                                                <div>
                                                    <p className="text-gray-800 font-semibold">
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Inscrit{" "}
                                                        {formatDistanceToNow(new Date(user.created_at), {
                                                            locale: fr,
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <PrimaryButton
                                                        className="text-sm"
                                                    >
                                                         <Link href={route('users.show', user.id)}>Voir</Link>
                                                    </PrimaryButton>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(user.id);
                                                        }}
                                                        className="flex items-center space-x-1 text-red-600 transition"
                                                    >
                                                        <FaTrashAlt />
                                                        <span>Supprimer</span>
                                                    </a>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {/* Pagination */}
                                    <div className="mt-6 flex justify-center">
                                        {[...Array(meta.last_page)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePagination(index + 1)}
                                                className={`px-3 py-1 mx-1 rounded ${
                                                    meta.current_page === index + 1
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-gray-800"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
