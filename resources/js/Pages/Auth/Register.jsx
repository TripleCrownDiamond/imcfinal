import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Register() {
    // Extraire sponsor_id de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sponsorId = urlParams.get("sponsor_id") || "";

    const [countries, setCountries] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [phoneCode, setPhoneCode] = useState("");
    const [acceptCGU, setAcceptCGU] = useState(false); // État pour la case CGU
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        sponsor_id: sponsorId,
        country_id: "",
        phone: "",
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("/countries");
                const groupedCountries = response.data.reduce((acc, country) => {
                    if (!acc[country.continent]) {
                        acc[country.continent] = [];
                    }
                    acc[country.continent].push(country);
                    return acc;
                }, {});
                setCountries(groupedCountries);
            } catch (error) {
                console.error("Erreur lors de la récupération des pays:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = (e) => {
        const selectedCountryId = e.target.value;

        const selectedCountry = Object.values(countries)
            .flat()
            .find((country) => country.id === parseInt(selectedCountryId));

        if (selectedCountry) {
            setPhoneCode(selectedCountry.phone_code);
        }

        setData("country_id", selectedCountryId);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!acceptCGU) {
            toast.error("Veuillez lire et accepter les CGU avant de vous inscrire.");
            return;
        }

        post(route("register"), {
            onSuccess: (response) => {
                if (response.props.flash?.success) {
                    toast.success(response.props.flash.success);
                    reset();
                    setTimeout(() => {
                        toast("Redirection en cours...");
                        setTimeout(() => {
                            window.location.href = route("login");
                        }, 1500);
                    }, 1000);
                }
            },
            onError: (errors) => {
                for (const error in errors) {
                    toast.error(errors[error]);
                }
            },
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div
                    className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
                    style={{
                        borderColor: "#88ae75 transparent #88ae75 transparent",
                    }}
                ></div>
            </div>
        );
    }

    return (
        <GuestLayout>
            <Head title="Inscription" />
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="first_name" value="Prenom" />
                    <TextInput
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="first_name"
                        isFocused={true}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.first_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="last_name" value="Nom" />
                    <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="last_name"
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.last_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Nom d'utilisateur" />
                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="username"
                        onChange={(e) => setData("username", e.target.value)}
                        required
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="E-mail" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="country" value="Pays" />
                    <select
                        id="country"
                        name="country"
                        value={data.country}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75] hover:border-[#88ae75] rounded-md"
                        onChange={handleCountryChange}
                        required
                    >
                        <option value="">Sélectionnez un pays</option>
                        {Object.keys(countries).map((continent) => (
                            <optgroup key={continent} label={continent}>
                                {countries[continent].map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <InputError message={errors.country} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Numéro de téléphone" />
                    <div className="flex items-center space-x-2">
                        <span className="bg-gray-200 text-gray-700 rounded-l-md px-4 py-2">
                            {phoneCode || "N/A"}
                        </span>
                        <TextInput
                            id="phone"
                            name="phone"
                            value={data.phone}
                            className="mt-1 block w-full rounded-r-md focus:ring focus:ring-[#88ae75]"
                            autoComplete="phone"
                            onChange={(e) => setData("phone", e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />
                    <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                    <a
                        href="#"
                        onClick={togglePasswordVisibility}
                        className="text-sm text-blue-600 hover:underline mt-1"
                    >
                        {showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"}
                    </a>
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />
                    <TextInput
                        id="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full focus:ring focus:ring-[#88ae75]"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Ajout de la case à cocher pour les CGU */}
                <div className="mt-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={acceptCGU}
                            onChange={(e) => setAcceptCGU(e.target.checked)}
                            className="focus:ring focus:ring-[#88ae75] text-[#88ae75]"
                        />
                        <span className="ml-2 text-gray-700">
                            J'ai lu et j'accepte les{" "}
                            <a href="https://imarket-consulting.com/conditions-generales-dutilisation/" className="text-blue-600 hover:underline">
                                conditions générales d'utilisation
                            </a>
                            .
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 hover:text-gray-900"
                    >
                        Déjà enregistré ?
                    </Link>

                    <PrimaryButton
                        className="ml-4"
                        disabled={processing}
                        processing={processing}
                    >
                        S'inscrire
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
