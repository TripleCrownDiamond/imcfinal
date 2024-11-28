<?php

namespace App\Http\Controllers;

use App\Models\Distinction;
use App\Models\User;
use App\Models\UserDistinction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NetworkController extends Controller
{
    public function show($userId)
    {
      
        $user = User::with('distinctions', 'downlines')->findOrFail($userId);

        // Récupérer les distinctions de l'utilisateur et les trier par date décroissante
        $userDistinctions = $user->distinctions;

        // Récupérer la prochaine distinction
        $nextDistinction = $this->getNextDistinction($userDistinctions);

        // Vérifier l'éligibilité pour la prochaine distinction
        $isEligible = $this->checkEligibility($user, $nextDistinction);

        // Générer la généalogie
        $downlines = $user->genealogy(4);

        //dd($downlines);

        // Récupérer les gains de l'utilisateur en les paginant
        // Dans le contrôleur
        $sponsorGains = $user->sponsorGains()->with(['sponsor', 'buyer'])->paginate(10);
        
        return Inertia::render('Network/Show', [
            'user' => $user,
            'userDistinctions' => $userDistinctions,
            'nextDistinction' => $nextDistinction,
            'isEligible' => $isEligible,
            'downlines' => $downlines,
            'sponsorGains' => $sponsorGains,
        ]);
    }


    private function getNextDistinction($userDistinctions)
    {
        $distinctions = Distinction::all();
        $nextDistinction = null;

        foreach ($distinctions as $distinction) {
            if (!$userDistinctions->contains('id', $distinction->id)) {
                $nextDistinction = $distinction;
                break;
            }
        }

        return $nextDistinction;
    }

    private function checkEligibility($user, $nextDistinction)
    {
        if (!$nextDistinction) {
            return false;
        }

        // Vérifier si l'utilisateur a accumulé suffisamment de I-Coin
        if ($user->balance < $nextDistinction->min_icoin) {
            return false;
        }

        // Vérifier les paliers pour YOUNG MENTOR et au-delà
        if ($nextDistinction->name === 'YOUNG MENTOR') {
            return $this->checkYoungMentorEligibility($user);
        } elseif ($nextDistinction->name === 'MENTOR GOLD') {
            return $this->checkMentorGoldEligibility($user);
        } elseif ($nextDistinction->name === 'LEADER MASTER') {
            return $this->checkLeaderMasterEligibility($user);
        } elseif ($nextDistinction->name === 'LEADER COMMANDER') {
            return $this->checkLeaderCommanderEligibility($user);
        } elseif ($nextDistinction->name === 'DIAMOND TOP LEADER') {
            return $this->checkDiamondTopLeaderEligibility($user);
        }

        return false;
    }

    private function checkYoungMentorEligibility($user)
    {
        return true;
    }

    private function checkMentorGoldEligibility($user)
    {
        // Vérifier que l'utilisateur a terminé la première généalogie et collecté 30 I-Coin
        if ($user->balance < 30 || $user->downlines()->count() < 3) {
            return false;
        }

        return true;
    }

    private function checkLeaderMasterEligibility($user)
    {
        // Vérifier si l'utilisateur a collecté au moins 2000 I-Coin
        if ($user->balance < 2000) {
            return false;
        }

        // Récupérer la généalogie jusqu'à 2 générations
        $genealogy = $user->genealogy(2);

        // Filtrer les downlines directes (génération 1)
        $validFirstGeneration = collect($genealogy)->filter(function ($downline) {
            // Vérifier si cette downline a au moins 3 sous-downlines
            return isset($downline['downlines']) && count($downline['downlines']) >= 3;
        });

        // Vérifier si l'utilisateur a au moins 3 downlines répondant au critère
        if ($validFirstGeneration->count() < 3) {
            return false;
        }

        return true;
    }

    private function checkLeaderCommanderEligibility($user)
    {
        // Vérifier si l'utilisateur a collecté au moins 10,000 I-Coin
        if ($user->balance < 10000) {
            return false;
        }

        // Récupérer la généalogie jusqu'à 3 générations
        $genealogy = $user->genealogy(3);

        // Vérifier la validité des 3 générations
        $validFirstGeneration = collect($genealogy)->filter(function ($downline) {
            // Vérifier si cette downline (génération 1) a au moins 3 sous-downlines (génération 2)
            if (!isset($downline['downlines']) || count($downline['downlines']) < 3) {
                return false;
            }

            // Vérifier pour chaque downline de la génération 2 si elle a au moins 3 sous-downlines (génération 3)
            $validSecondGeneration = collect($downline['downlines'])->filter(function ($secondDownline) {
                return isset($secondDownline['downlines']) && count($secondDownline['downlines']) >= 3;
            });

            // La génération 1 est valide si elle a 3 sous-downlines avec chacune 3 sous-downlines
            return $validSecondGeneration->count() >= 3;
        });

        // Vérifier si l'utilisateur a au moins 3 downlines directes répondant au critère
        if ($validFirstGeneration->count() < 3) {
            return false;
        }

        return true;
    }

    private function checkDiamondTopLeaderEligibility($user)
    {
        // Vérifier si l'utilisateur a collecté au moins 20,000 I-Coin
        if ($user->balance < 20000) {
            return false;
        }

        // Récupérer la généalogie jusqu'à 4 générations
        $genealogy = $user->genealogy(4);

        // Vérifier la validité des 4 générations
        $validFirstGeneration = collect($genealogy)->filter(function ($downline) {
            // Vérifier si cette downline (génération 1) a au moins 3 sous-downlines (génération 2)
            if (!isset($downline['downlines']) || count($downline['downlines']) < 3) {
                return false;
            }

            // Vérifier pour chaque downline de la génération 2 si elle a au moins 3 sous-downlines (génération 3)
            $validSecondGeneration = collect($downline['downlines'])->filter(function ($secondDownline) {
                // Vérifier si la génération 3 a au moins 3 sous-downlines
                if (!isset($secondDownline['downlines']) || count($secondDownline['downlines']) < 3) {
                    return false;
                }

                // Vérifier pour chaque downline de la génération 3 si elle a au moins 3 sous-downlines (génération 4)
                $validThirdGeneration = collect($secondDownline['downlines'])->filter(function ($thirdDownline) {
                    return isset($thirdDownline['downlines']) && count($thirdDownline['downlines']) >= 3;
                });

                // La génération 2 est valide si ses downlines ont 3 sous-downlines valides
                return $validThirdGeneration->count() >= 3;
            });

            // La génération 1 est valide si elle a 3 sous-downlines valides avec 3 sous-downlines chacun
            return $validSecondGeneration->count() >= 3;
        });

        // Vérifier si l'utilisateur a au moins 3 downlines directes répondant au critère
        if ($validFirstGeneration->count() < 3) {
            return false;
        }

        return true;
    }

    public function verifyDistinction($userId)
    {
        $user = User::findOrFail($userId);

        // Récupérer la prochaine distinction
        $nextDistinction = $this->getNextDistinction($user->distinctions);

        if (!$nextDistinction) {
            return redirect()->route('network.show', ['userId' => $user->id])
                ->with('error', 'Aucune distinction disponible.');
        }

        // Vérifier si l'utilisateur est déjà éligible à cette distinction
        $alreadyHasDistinction = $user->distinctions->contains($nextDistinction->id);

        if ($alreadyHasDistinction) {
            return redirect()->route('network.show', ['userId' => $user->id])
                ->with('error', 'Vous possédez déjà cette distinction.');
        }

        // Vérifier l'éligibilité
        $isEligible = $this->checkEligibility($user, $nextDistinction);

        if ($isEligible) {
            // Ajouter la distinction à l'utilisateur
            UserDistinction::create([
                'user_id' => $user->id,
                'distinction_id' => $nextDistinction->id,
                'date_acquired' => now(),
            ]);

            return redirect()->route('network.show', ['userId' => $user->id])
                ->with('success', 'Distinction mise à jour avec succès !');
        }

        return redirect()->route('network.show', ['userId' => $user->id])
            ->with('error', 'Vous n\'êtes pas éligible pour cette distinction.');
    }
}
