<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormationsTableSeeder extends Seeder
{
    public function run()
    {
        $formations = [
            [
                'name' => 'GENIUS TRADER',
                'description' => 'Introduction au forex, utilisation de la plateforme de trading, guide complet, assistance et analyse en mode démo.',
                'price_usd' => 100,
                'price_i_coin' => 223,
                'number_of_videos' => 1,
            ],
            [
                'name' => 'APOLLON TRADER',
                'description' => 'Formation KING FOREX incluant des stratégies de trading, utilisation de Meta Pro, prévisions hebdomadaires pendant un mois, signaux hebdomadaires pendant un mois, et assistance ainsi que conseils en mode réel sur le marché pendant un mois.',
                'price_usd' => 500,
                'price_i_coin' => 1112,
                'number_of_videos' => 2,
            ],
            [
                'name' => 'ZEUS TRADER PRO',
                'description' => 'Formation pour devenir trader professionnel, dévoilement des secrets du trading, introduction aux cryptomonnaies, formation crypto pro, attestation d’expertise Imarket, assistance illimitée en mode réel, signaux journaliers illimités et prévisions journalières illimitées, intégration à l’équipe des traders professionnels d’Imarket.',
                'price_usd' => 1250,
                'price_i_coin' => 2778,
                'number_of_videos' => 2,
            ],
        ];

        DB::table('formations')->insert($formations);
    }
}
