import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-hot-toast";

export default function Create() {
    const { flash } = usePage().props; // Récupérer les messages flash
    const mainCurrencyName = import.meta.env.VITE_MAIN_CURRENCY_NAME || 'I-Coin';

    const { data, setData, post, reset, errors } = useForm({
        name: "",
        description: "",
        price_usd: "",
        price_i_coin: "",
        number_of_videos: 0,
        video_links: [],
        files: [],
    });

    const [numberOfVideos, setNumberOfVideos] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price_usd", data.price_usd);
        formData.append("price_i_coin", data.price_i_coin);
        formData.append("number_of_videos", data.number_of_videos);
        
        data.video_links.forEach((link, index) => {
            formData.append(`video_links[${index}]`, link);
        });

        for (let i = 0; i < data.files.length; i++) {
            formData.append("files[]", data.files[i]);
        }

        post("/courses", {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onSuccess: () => {
                toast.success("Cours ajouté avec succès !");
                reset(); // Réinitialiser le formulaire
                setNumberOfVideos(0);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
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
                <label className="block text-gray-700" htmlFor={`video_link_${index}`}>
                    Lien de la Vidéo {index + 1}
                </label>
                <input
                    type="text"
                    id={`video_link_${index}`}
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

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter une Formation</h2>}
        >
            <Head title="Ajouter un Cours" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="name">Nom de la Formation</label>
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

                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.description && <div className="text-red-500">{errors.description}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="price_usd">Prix en USD</label>
                                    <input
                                        type="number"
                                        id="price_usd"
                                        value={data.price_usd}
                                        onChange={(e) => setData("price_usd", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.price_usd && <div className="text-red-500">{errors.price_usd}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="price_i_coin">Prix en {mainCurrencyName}</label>
                                    <input
                                        type="number"
                                        id="price_i_coin"
                                        value={data.price_i_coin}
                                        onChange={(e) => setData("price_i_coin", e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.price_i_coin && <div className="text-red-500">{errors.price_i_coin}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="number_of_videos">Nombre de Vidéos</label>
                                    <input
                                        type="number"
                                        id="number_of_videos"
                                        value={numberOfVideos}
                                        onChange={handleNumberOfVideosChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        min="0"
                                        required
                                    />
                                    {errors.number_of_videos && <div className="text-red-500">{errors.number_of_videos}</div>}
                                </div>

                                {renderVideoLinkInputs()}

                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="files">Télécharger des fichiers (multiples, non vidéos)</label>
                                    <input
                                        type="file"
                                        id="files"
                                        onChange={handleFileChange}
                                        multiple
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link href="/courses" className="text-gray-600 hover:text-gray-800 underline">
                                        Annuler
                                    </Link>
                                    <PrimaryButton type="submit">Ajouter le Cours</PrimaryButton>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
