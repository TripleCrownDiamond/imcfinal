<?php

namespace App\Http\Controllers;

use App\Models\FormationSubscription;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord de l'utilisateur.
     */
    public function index(): Response
    {
        // Récupérer l'utilisateur actuel
        $user = Auth::user();

        // Récupération des souscriptions et des souscriptions de formation
        $subscriptionsQuery = Subscription::query();
        $formationSubscriptionsQuery = $user->formationSubscriptions();

        if ($user->role === 'admin') {
            // L'admin voit toutes les souscriptions et formations actives
            $subscriptionsCount = $subscriptionsQuery->where('expiration_date', '>', now())->count();
            $formationSubscriptionsCount = FormationSubscription::count();
        } else {
            // Les autres utilisateurs voient uniquement leurs souscriptions actives
            $subscriptionsCount = $subscriptionsQuery->where('user_id', $user->id)
                ->where('expiration_date', '>', now())
                ->count();
            $formationSubscriptionsCount = $formationSubscriptionsQuery->count();
        }

        // Récupération du nombre de parrainages directs (exclure uniq_id "admin")
        $directReferralsCount = User::where('sponsor_id', $user->uniq_id)
            ->where('uniq_id', '!=', 'admin')
            ->count();

        // Récupération de la dernière distinction
        $lastDistinction = $user->distinctions()->latest('date_acquired')->first();
        $lastDistinctionName = $lastDistinction ? $lastDistinction->name : null;

        // Récupérer le nombre total d'utilisateurs
        $usersCount = User::count();

        // Rendu de la vue
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
                'users' => $usersCount,
                'directReferralsCount' => $directReferralsCount,
                'subscriptionsCount' => $subscriptionsCount,
                'formationSubscriptionsCount' => $formationSubscriptionsCount,
                'lastDistinction' => [
                    'id' => $lastDistinction ? $lastDistinction->id : null,
                    'name' => $lastDistinctionName,
                ],
            ],
        ]);
    }
}
