<?php

namespace App\Console\Commands;

use App\Models\TradingDeposit;
use App\Models\Subscription;
use App\Models\DepositGain;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CalculateDailyProfits extends Command
{
    protected $signature = 'profits:calculate-daily';
    protected $description = 'Calculer les gains quotidiens pour les dépôts en fonction de la durée de profit.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        Log::info('Début du calcul des gains journaliers.');

        // Récupérer toutes les souscriptions non expirées
        $subscriptions = Subscription::where('expiration_date', '>', Carbon::now())->get();

        if ($subscriptions->isEmpty()) {
            Log::info('Aucune souscription active trouvée.');
        }

        foreach ($subscriptions as $subscription) {
            Log::info('Traitement de la souscription ID: ' . $subscription->id);

            // Récupérer les dépôts associés à cette souscription
            $deposits = TradingDeposit::where('subscription_id', $subscription->id)->get();

            if ($deposits->isEmpty()) {
                Log::info('Aucun dépôt trouvé pour la souscription ID: ' . $subscription->id);
            }

            foreach ($deposits as $deposit) {
                $endDate = Carbon::parse($subscription->subscription_date)
                                ->addDays($subscription->bot->profit_duration_days);

                // Ne traiter que si la souscription n'est pas encore expirée
                if (Carbon::now()->lessThanOrEqualTo($endDate)) {
                    // Récupérer la dernière date où un gain a été octroyé
                    $lastGainDate = DepositGain::where('trading_deposit_id', $deposit->id)
                        ->orderBy('created_at', 'desc')
                        ->value('created_at');

                    // Déterminer la date de début pour les gains manquants
                    $startDate = $lastGainDate ? Carbon::parse($lastGainDate)->addDay() : Carbon::parse($subscription->subscription_date);

                    // Boucle à partir de la date de début jusqu'à aujourd'hui
                    for ($date = $startDate; $date->lessThan(Carbon::now()); $date->addDay()) {
                        $dailyProfit = ($deposit->amount * $subscription->bot->daily_profit_percentage) / 100;

                        Log::info('Création du gain pour le dépôt ID: ' . $deposit->id . ' pour la date: ' . $date->toDateString());

                        // Créer un nouveau gain avec la date correspondante
                        DepositGain::create([
                            'trading_deposit_id' => $deposit->id,
                            'gain_amount' => $dailyProfit,
                            'created_at' => $date,
                            'updated_at' => $date,
                        ]);

                        // Mettre à jour le solde de l'utilisateur
                        $user = User::find($subscription->user_id);
                        if ($user) {
                            $user->balance += $dailyProfit;
                            $user->save();

                            Log::info('Solde de l\'utilisateur ID: ' . $user->id . ' mis à jour avec un gain de: ' . $dailyProfit);
                        } else {
                            Log::warning('Utilisateur ID ' . $subscription->user_id . ' introuvable.');
                        }
                    }
                } else {
                    Log::info('La date d\'expiration de la souscription ID ' . $subscription->id . ' a été atteinte, pas de calcul de gain.');
                }
            }
        }

        $this->info('Calcul des gains journaliers terminé.');
        Log::info('Calcul des gains journaliers terminé.');
    }
}
