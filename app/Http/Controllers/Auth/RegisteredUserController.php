<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Country;
use App\Models\Distinction;
use App\Notifications\EmailVerificationNotification;
use App\Notifications\SponsorCongratulationsNotification;
use App\Notifications\WelcomeUserNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Récupérer les pays depuis la table "countries", triés par continent
        $countries = Country::all()->groupBy('continent');

        return Inertia::render('Auth/Register', [
            'countries' => $countries,
            'flash' => session('flash'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

    public function store(Request $request): RedirectResponse
    {
        // Validation des données
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'country_id' => 'required|string|max:255',
            'phone' => 'required|string', // Validation du téléphone
        ], [
            'first_name.required' => 'Le prénom est requis.',
            'first_name.string' => 'Le prénom doit être une chaîne de caractères.',
            'first_name.max' => 'Le prénom ne doit pas dépasser 255 caractères.',
            
            'last_name.required' => 'Le nom de famille est requis.',
            'last_name.string' => 'Le nom de famille doit être une chaîne de caractères.',
            'last_name.max' => 'Le nom de famille ne doit pas dépasser 255 caractères.',
            
            'username.required' => 'Le nom d\'utilisateur est requis.',
            'username.string' => 'Le nom d\'utilisateur doit être une chaîne de caractères.',
            'username.max' => 'Le nom d\'utilisateur ne doit pas dépasser 255 caractères.',
            'username.unique' => 'Ce nom d\'utilisateur est déjà utilisé.',
            
            'email.required' => 'L\'email est requis.',
            'email.string' => 'L\'email doit être une chaîne de caractères.',
            'email.lowercase' => 'L\'email doit être en minuscules.',
            'email.email' => 'L\'email doit être une adresse valide.',
            'email.max' => 'L\'email ne doit pas dépasser 255 caractères.',
            'email.unique' => 'Cet email est déjà utilisé.',
            
            'password.required' => 'Le mot de passe est requis.',
            'password.confirmed' => 'La confirmation du mot de passe doit correspondre.',
            
            'country_id.required' => 'Le pays est requis.',
            'country_id.string' => 'Le pays doit être une chaîne de caractères.',
            'country_id.max' => 'Le pays ne doit pas dépasser 255 caractères.',
            
            'phone.required' => 'Le numéro de téléphone est requis.',
            'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.', // Message personnalisé pour string
        ]);        

        // Récupération du code du pays en fonction du pays sélectionné
        $country = Country::find($request->country_id);
        $phone_code = $country ? $country->phone_code : ''; // Récupérer le code du pays

        // Suppression du '+' du code de pays et concaténation avec le numéro de téléphone
        $phone = ltrim($phone_code, '+') . ltrim($request->phone, '+'); // Si le numéro contient un '+', on le retire

        // Création de l'utilisateur
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'visible_password' => $request->password,
            'uniq_id' => Str::random(8),
            'role' => 'user',
            'balance' => 2,
            'sponsor_id' => $request->sponsor_id ?? 'admin',
            'country_id' => $request->country_id,
            'phone_number' =>  $phone, // Enregistrer le numéro de téléphone
        ]);

        // Attribuer la première distinction
        $firstDistinction = Distinction::first();
        if ($firstDistinction) {
            $user->distinctions()->attach($firstDistinction->id, [
                'date_acquired' => now(),
            ]);
        }

        // Envoi de l'e-mail de bienvenue
        //Notification::send($user, new WelcomeUserNotification());

        // Envoi de l'e-mail de félicitations au sponsor
        if ($request->sponsor_id !== 'admin') {
            $sponsor = User::find($request->sponsor_id);
            if ($sponsor) {
                //Notification::send($sponsor, new SponsorCongratulationsNotification($user));
            }
        }

        // Redirection avec message flash de succès
        return redirect()->route('register')->with('flash', ['success' => 'Inscription réussie. Bienvenue!']);
    }
}
