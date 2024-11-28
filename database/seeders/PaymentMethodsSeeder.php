<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    public function run()
    {
        // Récupérer la valeur de la variable d'environnement
        $mainCurrencyName = env('VITE_MAIN_CURRENCY_NAME', 'I-Coin'); // 'I-Coin' est la valeur par défaut

        $paymentMethods = [
            [
                'uniq_id' => strtolower("{$mainCurrencyName}"),
                'name' => "Solde en {$mainCurrencyName}.",
                'description' => "Utilisez votre solde en {$mainCurrencyName} pour faire le paiement.", // Utilisation de la variable d'environnement
                'is_active' => true, // Actif par défaut
            ],
        ];

        DB::table('payment_methods')->insert($paymentMethods);
    }
}
