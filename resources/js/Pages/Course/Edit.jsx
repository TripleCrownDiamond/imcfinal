import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-hot-toast";
import { Inertia } from "@inertiajs/inertia";
import { mainCurrency } from "@/utils/constants";


const appUrl = import.meta.env.APP_URL || "http://localhost:8000";

export default function Edit() {
    const { course, flash } = usePage().props;
    const mainCurrencyName = mainCurrency.name;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { data, setData, post, errors } = useForm({
        id: course.id,
        name: course.name,
        description: course.description,
        price_usd: course.price_usd,
        price_i_coin: course.price_i_coin,
        number_of_videos: course.number_of_videos,
        video_links: course.videos.map((video) => video.link) || [],
        files: [],
        existing_files: course.existing_files || [], // Utiliser les fichiers existants
    });

    const [numberOfVideos, setNumberOfVideos] = useState(
        course.number_of_videos
    );

    useEffect(() => {
        setNumberOfVideos(course.number_of_videos);
    }, [course.number_of_videos]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price_usd", data.price_usd);
        formData.append("price_i_coin", data.price_i_coin);
        formData.append("number_of_videos", data.number_of_videos);
    
        const videoArray = data.video_links.map((link) => ({ link }));
        formData.append("videos", JSON.stringify(videoArray));
    
        for (let i = 0; i < data.files.length; i++) {
            formData.append("files[]", data.files[i]);
        }
    
        post(`/courses/${data.id}`, {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onSuccess: (response) => {
                // Mettre à jour l'état avec les nouvelles données reçues
                setData((prevData) => ({
                    ...prevData,
                    ...response.course, // Supposons que la réponse contienne les nouvelles données du cours
                }));
    
                // Afficher un message de succès
                toast.success("Cours mis à jour avec succès !");
            },
            onError: (errors) => {
                if (flash.error) {
                    toast.error(flash.error);
                } else {
                    Object.values(errors).forEach((error) => {
                        toast.error(error);
                    });
                }
            },
        });
    };
      

    const handleFileChange = (e) => {
        setData("files", e.target.files);
    };

    const handleNumberOfVideosChange = (e) => {
        const value = e.target.value;
        setNumberOfVideos(value);
        setData("number_of_videos", value);
    };

    const renderVideoLinkInputs = () => {
        return Array.from({ length: numberOfVideos }, (_, index) => (
            <div key={index} className="mb-4">
                <label
                    className="block text-gray-700"
                    htmlFor={`video_link_${index}`}
                >
                    Lien de la Vidéo {index + 1}
                </label>
                <input
                    type="text"
                    id={`video_link_${index}`}
                    value={data.video_links[index] || ""}
                    onChange={(e) => {
                        const updatedLinks = [...data.video_links];
                        updatedLinks[index] = e.target.value;
                        setData("video_links", updatedLinks);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>
        ));
    };

    const handleDeleteFile = (fileId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
            Inertia.delete(`/courses/${data.id}/files/${fileId}/delete`, {
                onSuccess: () => {
                    // Utiliser le message flash pour afficher le message de succès
                    if (flash.success) {
                        toast.success(flash.success);
                    } else {
                        toast.success("Fichier supprimé avec succès !");
                    }
                },
                onError: (errors) => {
                    // Utiliser le message flash pour afficher les messages d'erreur
                    if (flash.error) {
                        toast.error(flash.error);
                    } else {
                        Object.values(errors).forEach((error) => {
                            toast.error(error);
                        });
                    }
                },
                // Vous pouvez également passer des options supplémentaires si nécessaire
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Modifier la Formation
                </h2>
            }
        >
            <Head title="Modifier un Cours" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="name"
                                    >
                                        Nom de la Formation
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="text-red-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="description"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.description && (
                                        <div className="text-red-500">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="price_usd"
                                    >
                                        Prix en USD
                                    </label>
                                    <input
                                        type="number"
                                        id="price_usd"
                                        value={data.price_usd}
                                        onChange={(e) =>
                                            setData("price_usd", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.price_usd && (
                                        <div className="text-red-500">
                                            {errors.price_usd}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="price_i_coin"
                                    >
                                        Prix en {mainCurrencyName}
                                    </label>
                                    <input
                                        type="number"
                                        id="price_i_coin"
                                        value={data.price_i_coin}
                                        onChange={(e) =>
                                            setData(
                                                "price_i_coin",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.price_i_coin && (
                                        <div className="text-red-500">
                                            {errors.price_i_coin}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="number_of_videos"
                                    >
                                        Nombre de Vidéos
                                    </label>
                                    <input
                                        type="number"
                                        id="number_of_videos"
                                        value={numberOfVideos}
                                        onChange={handleNumberOfVideosChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        min="0"
                                        required
                                    />
                                    {errors.number_of_videos && (
                                        <div className="text-red-500">
                                            {errors.number_of_videos}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        Liens des Vidéos
                                    </label>
                                    {renderVideoLinkInputs()}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700"
                                        htmlFor="files"
                                    >
                                        Fichiers
                                    </label>
                                    <input
                                        type="file"
                                        id="files"
                                        onChange={handleFileChange}
                                        multiple
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">
                                    Fichiers Existants
                                </h3>
                                <ul className="mb-4">
                                    {data.existing_files.map((file) => (
                                        <li
                                            key={file.id}
                                            className="flex justify-between items-center"
                                        >
                                            <span>{file.file_name}</span>
                                            <div className="flex items-center space-x-2">
                                                <a
                                                    href={`/storage/${file.file_path}`} // Ajoutez appUrl ici
                                                    className="text-blue-500 hover:underline"
                                                    download // Ajoute l'attribut pour le téléchargement
                                                >
                                                    Télécharger
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteFile(
                                                            file.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/courses"
                                        className="text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Annuler
                                    </Link>
                                    <PrimaryButton type="submit">
                                        Mettre à jour le Cours
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
