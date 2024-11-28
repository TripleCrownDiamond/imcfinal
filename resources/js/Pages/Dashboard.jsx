import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appDatas } from "@/utils/constants";
import { mainCurrency } from "@/utils/constants";
import { capitalize } from "@/utils/helpers";
import {
    faCoins,
    faUserFriends,
    faRobot,
    faLink,
    faClipboard,
    faAward,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function Dashboard() {
    const {
        user,
        directReferralsCount,
        subscriptionsCount,
        formationSubscriptionsCount,
        lastDistinction,
        users,
    } = usePage().props.auth;

    const referralLink = `${appDatas.url}/register?sponsor_id=${user.uniq_id}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            toast.success("Lien de parrainage copié avec succès!");
        } catch {
            toast.error("Erreur lors de la copie du lien.");
        }
    };

    const stats = [
        {
            title: `Solde en ${mainCurrency.code}`,
            value: `${user.balance} ${mainCurrency.code}`,
            icon: faCoins,
        },
        {
            title: "Filleul(s) direct(s)",
            value: `${directReferralsCount} Filleul(s) direct(s)`,
            icon: faUserFriends,
        },
        ...(user.role === "admin"
            ? [
                  {
                      title: "Total Utilisateurs",
                      value: `${users} Utilisateurs`,
                      icon: faUserFriends,
                  },
                  {
                      title: "Total Souscriptions aux bots",
                      value: `${subscriptionsCount} Souscription(s) active(s) à des bot(s)`,
                      icon: faRobot,
                  },
                  {
                      title: "Total Souscriptions aux formations",
                      value: `${formationSubscriptionsCount} Formation(s) active(s)`,
                      icon: faClipboard,
                  },
              ]
            : [
                  {
                      title: "Souscriptions aux bots",
                      value: `${subscriptionsCount} Souscription(s) active(s) à des bot(s)`,
                      icon: faRobot,
                  },
                  {
                      title: "Souscription aux formations",
                      value: `${formationSubscriptionsCount} Formation(s) active(s)`,
                      icon: faClipboard,
                  },
                  lastDistinction && {
                      title: "Dernière distinction",
                      value: lastDistinction.name,
                      icon: faAward,
                  },
              ]),
    ].filter(Boolean);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tableau de bord
                </h2>
            }
        >
            <Head title="Tableau de bord" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-4">
                        <div className="p-6 text-gray-900">
                            Bienvenue,{" "}
                            <strong className="font-bold text-black">
                                {capitalize(user.username)}
                            </strong>
                            !
                        </div>
                        {user.role === "admin" && (
                            <small className="p-6 text-gray-600">
                                Compte administrateur
                            </small>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map(({ title, value, icon }, index) => (
                            <Card key={index} title={title} value={value} icon={icon} />
                        ))}

                        <div className="bg-white shadow rounded-lg p-4">
                            <h3 className="text-lg font-normal flex items-center">
                                <div className="bg-[#88ae75] rounded-full p-2 mr-2">
                                    <FontAwesomeIcon
                                        icon={faLink}
                                        className="text-white"
                                    />
                                </div>
                                Lien de parrainage
                            </h3>
                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    value={referralLink}
                                    readOnly
                                    className="flex-1 border border-gray-300 rounded p-2"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="ml-2 bg-[#88ae75] text-white rounded px-4 py-2 flex items-center"
                                    aria-label="Copier le lien de parrainage"
                                >
                                    <FontAwesomeIcon icon={faClipboard} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Card({ title, value, icon }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-normal flex items-center">
                <div className="bg-[#88ae75] rounded-full p-2 mr-2">
                    <FontAwesomeIcon icon={icon} className="text-white" />
                </div>
                {title}
            </h3>
            <p className="mt-2 text-xl font-extrabold">{value}</p>
        </div>
    );
}
