import { Head, Link, useForm } from '@inertiajs/react';
import { toast, Toaster } from 'react-hot-toast'; // Importez toast et Toaster
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    // État pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: () => {
                // Afficher un toast en cas d'échec
                toast.error("Connexion échouée"); // Message d'erreur personnalisé
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="login" value="E-mail ou Nom d'utilisateur" />

                    <TextInput
                        id="login"
                        type="text"
                        name="login"
                        value={data.login} // Corrigez ici
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData('login', e.target.value)} // Corrigez ici
                    />

                    <InputError message={errors.login} className="mt-2" /> {/* Corrigez ici */}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'} // Afficher ou cacher le mot de passe
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="mt-2 text-sm text-gray-600 hover:underline"
                    >
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    </button>
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Se souvenir de moi
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Connexion
                    </PrimaryButton>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                        Vous n'avez pas encore de compte ?{' '}
                        <Link
                            href={route('register')}
                            className="text-indigo-600 underline hover:text-indigo-800"
                        >
                            Créer un compte
                        </Link>
                    </span>
                </div>
            </form>

        </GuestLayout>
    );
}
