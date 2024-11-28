<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\TradingBot;
use App\Models\TradingDeposit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;




class TradingBotController extends Controller
{
    public function index()
    {
        // Récupérer les bots par ordre décroissant
        $bots = TradingBot::orderBy('created_at', 'desc')->get();

        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Récupérer les ID des bots auxquels l'utilisateur est abonné et dont la souscription est encore active
        $subscriptions = Subscription::where('user_id', $user->id)
            ->where('expiration_date', '>', now()) // Vérifie que la date d'expiration n'est pas atteinte
            ->latest('expiration_date') // Récupère la souscription la plus récente
            ->pluck('bot_id')
            ->toArray();

        // Envoyer les bots et les souscriptions à la vue
        return inertia(
            'Bot/BotList',
            [
                'bots' => $bots,
                'subscriptions' => $subscriptions,
                'userRole' => $user->role,
            ]
        );
    }

    public function create()
    {
        // Vérifiez si l'utilisateur est admin avant d'autoriser l'ajout d'un bot
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('bots.index')->with('flash', ['error' => 'Accès refusé !']);
        }

        // Afficher le formulaire de création de bot
        return inertia('Bot/Create');
    }

    public function store(Request $request)
    {
        // Valider les données
        $request->validate([
            'name' => 'required|string|max:255',
            'cost_icoin' => 'required|numeric',
            'cost_usd' => 'required|numeric',
            'duration_days' => 'required|integer',
            'minimum_deposit_icoin' => 'required|numeric',
            'minimum_deposit_usd' => 'required|numeric',
            'daily_profit_percentage' => 'required|numeric',
            'profit_duration_days' => 'required|integer',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',

            'cost_icoin.required' => 'Le coût en I-Coin est obligatoire.',
            'cost_icoin.numeric' => 'Le coût en I-Coin doit être un nombre.',

            'cost_usd.required' => 'Le coût en USD est obligatoire.',
            'cost_usd.numeric' => 'Le coût en USD doit être un nombre.',

            'duration_days.required' => 'La durée en jours est obligatoire.',
            'duration_days.integer' => 'La durée en jours doit être un nombre entier.',

            'minimum_deposit_icoin.required' => 'Le dépôt minimum en I-Coin est obligatoire.',
            'minimum_deposit_icoin.numeric' => 'Le dépôt minimum en I-Coin doit être un nombre.',

            'minimum_deposit_usd.required' => 'Le dépôt minimum en USD est obligatoire.',
            'minimum_deposit_usd.numeric' => 'Le dépôt minimum en USD doit être un nombre.',

            'daily_profit_percentage.required' => 'Le pourcentage de profit quotidien est obligatoire.',
            'daily_profit_percentage.numeric' => 'Le pourcentage de profit quotidien doit être un nombre.',

            'profit_duration_days.required' => 'La durée de profit en jours est obligatoire.',
            'profit_duration_days.integer' => 'La durée de profit en jours doit être un nombre entier.',
        ]);

        // Générer un ID unique (par exemple un string aléatoire)
        $uniq_id = strtoupper(bin2hex(random_bytes(6))); // Génère un ID unique de 12 caractères (6 bytes)

        // Ajouter 'uniq_id' au tableau de données
        $data = $request->all();
        $data['uniq_id'] = $uniq_id;

        // Créer le bot de trading
        TradingBot::create($data);

        return redirect()->route('bots.create')->with('flash', [
            'success' => 'Bot ajouté avec succès !',
        ]);
    }

    public function show($id)
    {
        $bot = TradingBot::findOrFail($id);

        return inertia('Bot/BotDetails', [
            'bot' => $bot,
        ]);
    }

    public function edit($id)
    {
        $bot = TradingBot::findOrFail($id);

        // Retourner la vue d'édition avec les données du bot
        return inertia('Bot/Edit', [
            'bot' => $bot,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Valider les données avec messages personnalisés
        $request->validate([
            'name' => 'required|string|max:255',
            'cost_icoin' => 'required|numeric',
            'cost_usd' => 'required|numeric',
            'duration_days' => 'required|integer',
            'minimum_deposit_icoin' => 'required|numeric',
            'minimum_deposit_usd' => 'required|numeric',
            'daily_profit_percentage' => 'required|numeric',
            'profit_duration_days' => 'required|integer',
        ], [
            'name.required' => 'Le champ nom est requis.',
            'name.string' => 'Le champ nom doit être une chaîne de caractères.',
            'name.max' => 'Le champ nom ne doit pas dépasser 255 caractères.',

            'cost_icoin.required' => 'Le champ coût en I-Coin est requis.',
            'cost_icoin.numeric' => 'Le champ coût en I-Coin doit être un nombre.',

            'cost_usd.required' => 'Le champ coût en USD est requis.',
            'cost_usd.numeric' => 'Le champ coût en USD doit être un nombre.',

            'duration_days.required' => 'Le champ durée en jours est requis.',
            'duration_days.integer' => 'Le champ durée en jours doit être un nombre entier.',

            'minimum_deposit_icoin.required' => 'Le champ dépôt minimum en I-Coin est requis.',
            'minimum_deposit_icoin.numeric' => 'Le champ dépôt minimum en I-Coin doit être un nombre.',

            'minimum_deposit_usd.required' => 'Le champ dépôt minimum en USD est requis.',
            'minimum_deposit_usd.numeric' => 'Le champ dépôt minimum en USD doit être un nombre.',

            'daily_profit_percentage.required' => 'Le champ pourcentage de profit quotidien est requis.',
            'daily_profit_percentage.numeric' => 'Le champ pourcentage de profit quotidien doit être un nombre.',

            'profit_duration_days.required' => 'Le champ durée de profit en jours est requis.',
            'profit_duration_days.integer' => 'Le champ durée de profit en jours doit être un nombre entier.',
        ]);


        // Trouver le bot et mettre à jour les données
        $bot = TradingBot::findOrFail($id);
        $bot->update($request->all());

        return redirect()->route('bots.index')->with('flash', [
            'success' => 'Bot mis à jour avec succès !',
        ]);
    }

    public function destroy($id)
    {
        $bot = TradingBot::find($id);

        if ($bot && $bot->delete()) {
            return redirect()->route('bots.index')->with('flash', [
                'success' => 'Bot supprimé avec succès !',
            ]);
        }

        return redirect()->route('bots.index')->with('flash', [
            'error' => 'Erreur lors de la suppression du bot !',
        ]);
    }


    public function trading($id)
    {
        // Récupère le bot spécifique avec l'ID fourni
        $bot = TradingBot::findOrFail($id);

        // Récupère l'utilisateur actuel
        $user = Auth::user();

        // Si l'utilisateur a le rôle d'admin, il peut accéder au trading sans abonnement actif
        if ($user->role === 'admin') {
            // Paginer les dépôts associés au bot pour l'admin, sans se soucier de l'abonnement
            $tradingDeposits = TradingDeposit::where('bot_id', $id)
                ->paginate(10); // Définit 10 éléments par page

            return Inertia::render('Bot/Trading', [
                'bot' => $bot,
                'minimum_deposit' => $bot->minimum_deposit_icoin,
                'isActiveSubscription' => true, // Considéré actif pour l'admin
                'subscription_id' => null, // Pas d'abonnement requis
                'tradingDeposits' => $tradingDeposits, // Données paginées pour les dépôts
            ]);
        }

        // Récupère la souscription la plus récente de l'utilisateur pour ce bot
        $subscription = Subscription::where('user_id', $user->id)
            ->where('bot_id', $id)
            ->orderByDesc('expiration_date')
            ->first();

        // Vérifie si l'utilisateur est abonné et si l'abonnement est actif
        $isActiveSubscription = $subscription && $subscription->expiration_date > now();

        if (!$isActiveSubscription) {
            return redirect()->route('bots.index')->with('flash', [
                'error' => 'Votre abonnement a expiré. Veuillez renouveler votre abonnement pour continuer.'
            ]);
        }

        // Paginer les dépôts associés à cette souscription, avec leurs gains
        $tradingDeposits = TradingDeposit::with('gains')
            ->where('subscription_id', $subscription->id)
            ->paginate(10); // Définit 10 éléments par page

        return Inertia::render('Bot/Trading', [
            'bot' => $bot,
            'minimum_deposit' => $bot->minimum_deposit_icoin,
            'isActiveSubscription' => $isActiveSubscription,
            'subscription_id' => $subscription->id,
            'tradingDeposits' => $tradingDeposits, // Données paginées pour les dépôts
        ]);
    }

    public function deposit(Request $request, $subscriptionId)
    {
        // Validation des données
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);
    
        $user = Auth::user();
    
        if ($user->balance < $request->input('amount')) {
            $response = redirect()->back()->with('flash', ['error' => 'Fonds insuffisants !']);
           
            return $response;
        }
    
        $user->deductBalance($request->input('amount'));
    
        // Création du dépôt
        TradingDeposit::create([
            'uniq_id' => Str::uuid(),
            'amount' => $request->input('amount'),
            'user_id' => Auth::id(),
            'subscription_id' => $subscriptionId,  // Utilisation de subscriptionId pour lier le dépôt à un abonnement
        ]);
    
        $response = redirect()->back()->with('flash', ['success' => 'Dépôt effectué avec succès !']);
     
        return $response;
    }
    
}
