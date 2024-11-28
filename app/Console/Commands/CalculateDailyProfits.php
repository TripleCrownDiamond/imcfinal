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
    protected $description = 'Calculer les gains journaliers pour les dépôts.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        Log::info('Début du calcul des gains journaliers.');

        // Récupérer toutes les souscriptions actives
        $subscriptions = Subscription::where('expiration_date', '>', Carbon::now())->get();

        if ($subscriptions->isEmpty()) {
            Log::info('Aucune souscription active trouvée.');
            return;
        }

        foreach ($subscriptions as $subscription) {
            Log::info('Traitement de la souscription ID: ' . $subscription->id);

            // Récupérer les dépôts liés à cette souscription
            $deposits = TradingDeposit::where('subscription_id', $subscription->id)->get();

            foreach ($deposits as $deposit) {
                // Calculer la date de début des gains
                $gainStartDate = Carbon::parse($deposit->created_at);
                $today = Carbon::today();

                if ($today->greaterThan($subscription->expiration_date)) {
                    Log::info('La souscription ID ' . $subscription->id . ' est expirée.');
                    continue;
                }

                // Vérifier si un gain pour aujourd'hui a déjà été attribué
                $existingGain = DepositGain::where('trading_deposit_id', $deposit->id)
                    ->whereDate('created_at', $today)
                    ->exists();

                if ($existingGain) {
                    Log::info('Un gain a déjà été attribué pour le dépôt ID: ' . $deposit->id . ' aujourd\'hui.');
                    continue;
                }

                // Calculer le profit quotidien
                $dailyProfit = ($deposit->amount * $subscription->bot->daily_profit_percentage) / 100;

                // Ajouter le gain pour aujourd'hui
                DepositGain::create([
                    'trading_deposit_id' => $deposit->id,
                    'gain_amount' => $dailyProfit,
                    'created_at' => $today,
                    'updated_at' => $today,
                ]);

                // Mettre à jour le solde de l'utilisateur
                $user = User::find($subscription->user_id);
                if ($user) {
                    $user->balance += $dailyProfit;
                    $user->save();

                    Log::info('Gain de ' . $dailyProfit . ' ajouté au solde de l\'utilisateur ID: ' . $user->id);
                } else {
                    Log::warning('Utilisateur ID ' . $subscription->user_id . ' introuvable.');
                }
            }
        }

        $this->info('Calcul des gains journaliers terminé.');
        Log::info('Calcul des gains journaliers terminé.');
    }
}
