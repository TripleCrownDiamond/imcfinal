<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\TradingDeposit;
use App\Models\DepositGain;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    /**
     * Handle the payment processing for active subscriptions.
     *
     * @return RedirectResponse
     */
    public function handlePayments(): RedirectResponse
    {
        // Log the start of payment processing
        Log::info('Début du calcul des gains journaliers pour les paiements.');

        // Récupérer toutes les souscriptions actives
        $subscriptions = Subscription::where('expiration_date', '>', Carbon::now())->get();

        // Vérifier si aucune souscription active n'est trouvée
        if ($subscriptions->isEmpty()) {
            Log::info('Aucune souscription active trouvée.');
            return redirect()->back()->with('flash', ['error', 'Aucune souscription active.']);
        }

        foreach ($subscriptions as $subscription) {
            Log::info('Traitement de la souscription ID: ' . $subscription->id);

            // Récupérer les dépôts associés à cette souscription
            $deposits = TradingDeposit::where('subscription_id', $subscription->id)->get();

            if ($deposits->isEmpty()) {
                Log::info('Aucun dépôt trouvé pour la souscription ID: ' . $subscription->id);
            }

            foreach ($deposits as $deposit) {
                // Vérifier les dates de paiement et calculer les gains pour les jours non payés
                $startDate = Carbon::parse($subscription->subscription_date);
                $endDate = Carbon::parse($subscription->subscription_date)->addDays($subscription->bot->profit_duration_days);
                $today = Carbon::now();

                // Vérifier si la souscription est toujours active
                if ($today->greaterThanOrEqualTo($startDate) && $today->lessThanOrEqualTo($endDate)) {
                    // Calculer les gains à partir de la date d'abonnement
                    $missedDays = $today->diffInDays($startDate);

                    for ($i = 0; $i < $missedDays; $i++) {
                        $dailyProfit = ($deposit->amount * $subscription->bot->daily_profit_percentage) / 100;

                        // Créer un nouveau gain pour le jour manqué
                        DepositGain::create([
                            'trading_deposit_id' => $deposit->id,
                            'gain_amount' => $dailyProfit,
                        ]);
                        Log::info('Gain créé pour le dépôt ID: ' . $deposit->id . ' pour le jour ' . ($i + 1));

                        // Créditer l'utilisateur avec le gain calculé
                        $user = User::find($subscription->user_id);
                        if ($user) {
                            $user->balance += $dailyProfit; // Ajouter le gain au solde de l'utilisateur
                            $user->save();
                            Log::info('Solde de l\'utilisateur ID: ' . $user->id . ' mis à jour avec un gain de: ' . $dailyProfit);
                        } else {
                            Log::warning('Utilisateur ID ' . $subscription->user_id . ' introuvable.');
                        }
                    }
                }
            }
        }

        Log::info('Calcul des gains journaliers terminé.');

        // Si tout s'est bien passé, on renvoie un message de succès
        return redirect()->back()->with('flash', ['success', 'Paiements traités avec succès.']);
    }
}
