<?php

namespace App\Services;

use App\Models\User;
use App\Models\SponsorGain;

class SponsorService
{
    // Méthode pour récupérer les sponsors
    function getSponsors($userId, $level = 4)
    {
        $sponsors = [];
        
        for ($i = 0; $i < $level; $i++) {
            $user = User::find($userId);

            // Vérification si l'utilisateur est trouvé
            if (!$user) {
                return $sponsors; // Retourner un tableau vide si l'utilisateur n'est pas trouvé
            }

            if ($user->sponsor_id) {
                $sponsor = User::where('uniq_id', $user->sponsor_id)->first();

                if ($sponsor) {
                    $sponsors[] = $sponsor; // Ajoute le sponsor à la liste
                    $userId = $sponsor->id;
                } else {
                    // Si le sponsor n'est pas trouvé, simplement continuer
                    break;
                }
            } else {
                // Si l'utilisateur n'a pas de sponsor_id, sortir de la boucle
                break;
            }
        }

        return $sponsors;
    }

    public function calculateTotalSponsorGains(User $user, float $productCost): float
    {
        $sponsors = $this->getSponsors($user->id);
        $distributionPercentages = [
            'YOUNG MENTOR' => [0.04, 0.02, 0.01, 0.01],
            'MENTOR GOLD' => [0.04, 0.02, 0.01, 0.01],
            'LEADER MASTER' => [0.05, 0.02, 0.01, 0.01],
            'LEADER COMMANDER' => [0.05, 0.02, 0.01, 0.01],
            'DAIMOND TOP LEADER' => [0.06, 0.02, 0.01, 0.01],
        ];

        $totalGains = 0;

        foreach ($sponsors as $level => $sponsor) {
            // Utiliser directement $sponsor pour obtenir les distinctions
            $lastDistinction = $sponsor->distinctions()->latest('date_acquired')->first();

            if ($lastDistinction && isset($distributionPercentages[$lastDistinction->name][$level])) {
                $percentage = $distributionPercentages[$lastDistinction->name][$level];
                $totalGains += $productCost * $percentage;
            }
        }

        return $totalGains;
    }


    public function distributeGainsToSponsors(User $user, float $productCost): void
    {
        $sponsors = $this->getSponsors($user->id);
        $distributionPercentages = [
            'YOUNG MENTOR' => [0.04, 0.02, 0.01, 0.01],
            'MENTOR GOLD' => [0.04, 0.02, 0.01, 0.01],
            'LEADER MASTER' => [0.05, 0.02, 0.01, 0.01],
            'LEADER COMMANDER' => [0.05, 0.02, 0.01, 0.01],
            'DAIMOND TOP LEADER' => [0.06, 0.02, 0.01, 0.01],
        ];
    
        foreach ($sponsors as $level => $sponsor) {
            $percentage = $distributionPercentages['YOUNG MENTOR'][$level] ?? 0; // Valeur par défaut
            $lastDistinction = $sponsor->distinctions()->latest('date_acquired')->first();
    
            if ($lastDistinction && isset($distributionPercentages[$lastDistinction->name][$level])) {
                $percentage = $distributionPercentages[$lastDistinction->name][$level];
                $gain = $productCost * $percentage;
    
                // Mise à jour du solde du sponsor
                $sponsor->balance += $gain;
                $sponsor->save();
    
                // Enregistrement du gain du sponsor
                SponsorGain::create([
                    'sponsor_uniq_id' => $sponsor->uniq_id,
                    'buyer_uniq_id' => $user->uniq_id,
                    'product_cost' => $productCost,
                    'gain_amount' => $gain,
                ]);
            }
        }
    }
    
}
