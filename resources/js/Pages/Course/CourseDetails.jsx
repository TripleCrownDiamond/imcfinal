import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FiDownload } from "react-icons/fi"; // Icône de téléchargement

export default function CourseDetails({ course, videos, files }) {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const nextPage = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    const prevPage = () => {
        if (currentVideoIndex > 0) {
            setCurrentVideoIndex(currentVideoIndex - 1);
        }
    };

    const getEmbedLink = (link) => {
        // Gestion des liens YouTube
        if (link.includes("youtube.com/watch?v=")) {
            const videoId = link.split("v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // Gestion des liens Vimeo
        else if (link.includes("vimeo.com/")) {
            const videoId = link.split("/").pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }

        // Gestion des liens Google Drive
        else if (link.includes("drive.google.com/file/d/")) {
            const fileId = link.split("/d/")[1].split("/")[0];
            return `https://drive.google.com/uc?export=preview&id=${fileId}`;
        }

        // Ajouter d'autres sources de vidéo ici

        return link; // Retourne le lien brut si aucune correspondance n'est trouvée
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {course.name}
                </h2>
            }
        >
            <div className="py-4 px-6 mx-auto max-w-7xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {course.name}
                    </h1>
                    <Link
                        href="/courses"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Retour à la liste des cours
                    </Link>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>

                {videos.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Vidéo {currentVideoIndex + 1} sur {videos.length}
                        </h2>
                        <iframe
                            src={getEmbedLink(videos[currentVideoIndex].link)}
                            title={`Vidéo ${currentVideoIndex + 1}`}
                            className="w-full h-96 mt-4"
                            allowFullScreen
                        ></iframe>

                        <div className="flex justify-between mt-6">
                            <SecondaryButton
                                onClick={prevPage}
                                disabled={currentVideoIndex === 0}
                            >
                                Précédent
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={nextPage}
                                disabled={
                                    currentVideoIndex === videos.length - 1
                                }
                            >
                                Suivant
                            </PrimaryButton>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-6">
                        Aucune vidéo trouvée pour ce cours.
                    </p>
                )}

                {/* Affichage des fichiers */}
                {files.length > 0 ? (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Fichiers disponibles
                        </h2>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-gray-800">
                                        {file.file_name}
                                    </span>
                                    <a
                                        href={`/storage/${file.file_path}`}
                                        download
                                        className="text-blue-600 flex items-center hover:text-blue-800"
                                    >
                                        Télécharger{" "}
                                        <FiDownload className="ml-2" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-6">
                        Aucun fichier disponible pour ce cours.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
