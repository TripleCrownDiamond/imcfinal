import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr"; // Importez la locale française si nécessaire

export default function CourseList({ courses, userRole, subscriptions }) {
    const { flash } = usePage().props;

    const mainCurrencyName =
        import.meta.env.VITE_MAIN_CURRENCY_NAME || "I-Coin";

    const handleDelete = async (courseId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
            Inertia.delete(`/courses/${courseId}`);
        }
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Formations
                </h2>
            }
        >
            <Head title="Formations" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {userRole === "admin" && (
                        <div className="flex justify-end mb-4">
                            <Link href="/courses/create">
                                <PrimaryButton>
                                    <FaPlus className="mr-2" /> Ajouter un cours
                                </PrimaryButton>
                            </Link>
                        </div>
                    )}
                     {/* Section de support */}
                     <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Si vous avez des questions ou besoin d'assistance
                            concernant une formation, veuillez contacter notre
                            support via{" "}
                            <a
                                href="https://t.me/ImarketCooporate12"
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Support formation
                            </a>
                            .
                        </p>
                    </div>
                    <br />
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <ul>
                                {courses.map((course) => {
                                    const isSubscribed = subscriptions.includes(
                                        course.id
                                    );
                                    return (
                                        <li
                                            key={course.id}
                                            className="border-b border-gray-300 py-4 hover:bg-gray-100 transition duration-200"
                                        >
                                            <h3 className="text-lg font-semibold text-[#cd8b76]">
                                                {course.name}
                                            </h3>
                                            <p className="text-gray-700">
                                                {course.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-gray-500">
                                                    Vidéos:{" "}
                                                    <strong>
                                                        {
                                                            course.number_of_videos
                                                        }
                                                    </strong>
                                                </span>
                                                <div className="flex space-x-2">
                                                    <span className="text-sm text-black">
                                                        Prix en dollars:{" "}
                                                        <strong className="text-xl font-bold text-[#82b170]">
                                                            ${course.price_usd}
                                                        </strong>{" "}
                                                        USD
                                                    </span>
                                                    <span>|</span>
                                                    <span className="text-sm text-black">
                                                        Prix en{" "}
                                                        {mainCurrencyName}:{" "}
                                                        <strong className="text-xl font-bold text-[#82b170]">
                                                            {
                                                                course.price_i_coin
                                                            }
                                                        </strong>{" "}
                                                        {mainCurrencyName}
                                                    </span>
                                                </div>
                                            </div>
                                            {new Date(course.created_at) >
                                                new Date(
                                                    Date.now() -
                                                        365 *
                                                            24 *
                                                            60 *
                                                            60 *
                                                            1000
                                                ) && (
                                                <span className="text-sm text-gray-500">
                                                    Ajouté{" "}
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            course.created_at
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: fr,
                                                        }
                                                    )}
                                                </span>
                                            )}

                                            <div className="mt-4 flex space-x-4">
                                                {userRole === "admin" ? (
                                                    <>
                                                        <Link
                                                            href={`/course/${course.id}`}
                                                        >
                                                            <SecondaryButton>
                                                                Voir la
                                                                formation
                                                            </SecondaryButton>
                                                        </Link>

                                                        <Link
                                                            href={`/courses/${course.id}/edit`}
                                                            className="flex items-center space-x-1"
                                                        >
                                                            <FaEdit />
                                                            <span>Éditer</span>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    course.id
                                                                )
                                                            }
                                                            className="flex items-center space-x-1 text-red-600"
                                                        >
                                                            <FaTrashAlt />
                                                            <span>
                                                                Supprimer
                                                            </span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {isSubscribed ? (
                                                            <Link
                                                                href={`/course/${course.id}`}
                                                            >
                                                                <SecondaryButton>
                                                                    Voir la
                                                                    formation
                                                                </SecondaryButton>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`/checkout/course/${course.id}`}
                                                            >
                                                                <PrimaryButton>
                                                                    Acheter
                                                                    cette
                                                                    formation
                                                                </PrimaryButton>
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                   
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
