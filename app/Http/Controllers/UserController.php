<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\FormationSubscription;
use App\Models\KYC;
use App\Models\Subscription;
use App\Models\TradingBot;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index()
    {
        return Inertia::render('User/Index', [
            'users' => [], // Par défaut, une liste vide
        ]);
    }

    public function apiIndex(Request $request)
    {
        $users = User::where('role', '!=', 'admin')->paginate(10);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(User $user)
    {
        // Charger les relations nécessaires de l'utilisateur
        $user->load([
            'distinctions',
            'subscriptions.bot',
            'formationSubscriptions.formation', // Charger les formations avec les souscriptions
            'country',
            'sponsor',
            'kyc', // Charger les informations KYC
        ]);

        // Récupérer les souscriptions actives du user avec les bots associés
        $activeSubscriptions = $user->subscriptions()
            ->where('expiration_date', '>', now()) // Filtre sur les souscriptions actives
            ->with('bot') // Charger la relation 'bot' pour chaque souscription active
            ->get();

        // Récupérer les formations auxquelles l'utilisateur est abonné
        $activeFormationSubscriptions = $user->formationSubscriptions;

        // Charger toutes les formations et bots
        $formations = Formation::all();
        $bots = TradingBot::all();

        // Passer les données à Inertia
        return Inertia::render('User/Show', [
            'user' => $user,
            'formations' => $formations,
            'bots' => $bots,
            'activeSubscriptions' => $activeSubscriptions, // Souscriptions actives
            'activeFormationSubscriptions' => $activeFormationSubscriptions, // Formations actives
            'kyc' => $user->kyc, // Ajouter les informations KYC
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('flash', ['success', 'Utilisateur supprimé avec succès.']);
    }

    public function subscribeToFormation(Request $request)
    {
        $userId = $request->user_id; // Récupérer l'ID de l'utilisateur depuis la requête

        // Vérifier si l'utilisateur existe
        $user = User::find($userId);
        if (!$user) {
            return back()->with('error', 'Utilisateur non trouvé.');
        }

        // Vérifier si l'utilisateur est déjà abonné à la formation
        $existingSubscription = FormationSubscription::where('user_id', $user->id)
            ->where('formation_id', $request->formation_id)
            ->first();

        if ($existingSubscription) {
            return back()->with('error', 'Vous êtes déjà abonné à cette formation.');
        }

        // Ajouter la souscription à la formation
        FormationSubscription::create([
            'user_id' => $user->id,
            'formation_id' => $request->formation_id,
        ]);

        return back()->with('success', 'Souscription à la formation réussie.');
    }


    public function subscribeToBot(Request $request, User $user)
    {
        // Vérifier si la durée est un nombre valide
        $duration = intval($request->duration_days);  // Convertir en entier

        // Vérifier si la conversion a échoué et si la durée est un nombre positif
        if ($duration <= 0) {
            return back()->with('error', 'La durée d\'abonnement doit être un nombre positif.');
        }

        // Vérifier si l'utilisateur est déjà abonné à ce bot
        $existingSubscription = Subscription::where('user_id', $user->id)
            ->where('bot_id', $request->bot_id)
            ->where('expiration_date', '>', now())
            ->first();

        if ($existingSubscription) {
            return back()->with('error', 'Vous êtes déjà abonné à ce bot.');
        }

        // Ajouter la souscription au bot
        Subscription::create([
            'user_id' => $user->id,
            'bot_id' => $request->bot_id,
            'subscription_date' => now(),
            'expiration_date' => now()->addDays($duration),
        ]);

        return back()->with('success', 'Souscription au bot réussie.');
    }

    public function updateKycStatus(Request $request)
    {
        // Afficher toutes les données reçues pour déboguer
    
        // Valider les entrées
        $validated = $request->validate([
            'documentId' => 'required|integer', // ID du document requis
            'status' => 'required|in:verified,rejected', // Statut requis et valide
        ]);
    
        // Recherche du document KYC par son ID
        $document = KYC::find($validated['documentId']);
    
        // Vérifier si le document existe
        if (!$document) {
            return back()->with('error', 'Document KYC non trouvé.');
        }
    
        // Mettre à jour le statut du document KYC
        $document->status = $validated['status'];
        $document->save();
    
        // Rediriger avec un message de succès
        return back()->with('success', 'Le statut KYC a été mis à jour avec succès.');
    }
    
    


    public function unsubscribeFromFormation(User $user, $formationId)
    {
        $subscription = FormationSubscription::where('user_id', $user->id)
            ->where('formation_id', $formationId)
            ->first();

        if ($subscription) {
            $subscription->delete();
            return back()->with('success', 'Souscription à la formation annulée.');
        }

        return back()->with('error', 'Souscription non trouvée.');
    }

    public function unsubscribeFromBot(User $user, $botId)
    {
        $subscription = Subscription::where('user_id', $user->id)
            ->where('bot_id', $botId)
            ->first();

        if ($subscription) {
            $subscription->delete();
            return back()->with('success', 'Souscription au bot annulée.');
        }

        return back()->with('error', 'Souscription non trouvée.');
    }
}
