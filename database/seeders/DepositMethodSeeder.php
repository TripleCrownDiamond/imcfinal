<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepositMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('deposit_methods')->insert([
            [
                'name' => 'MasterCard',
                'description' => 'Effectuez un paiement directement depuis votre carte de crédit internationale MasterCard. Il n\'y a pas d\'adresse spécifique à copier pour cette méthode. Si vous rencontrez des problèmes, veuillez contacter notre support.',
            ],
            [
                'name' => 'Perfect Money',
                'description' => 'Un système de paiement électronique rapide et sécurisé. Copiez l\'adresse fournie dans votre compte Perfect Money et effectuez le paiement. Si vous avez besoin d\'assistance, contactez le support.',
            ],
            [
                'name' => 'Bitcoin',
                'description' => 'Utilisez la cryptomonnaie décentralisée Bitcoin pour effectuer des paiements en ligne. Copiez l\'adresse Bitcoin fournie et effectuez la transaction. Si vous avez des questions ou des soucis, contactez notre support pour confirmation.',
            ],
            [
                'name' => 'USDT',
                'description' => 'USDT (Tether) est un stablecoin qui permet des transactions sécurisées. Copiez l\'adresse USDT fournie et effectuez votre paiement. Si vous avez besoin d\'aide, contactez le support pour confirmation.',
            ],
            [
                'name' => 'Mobile Money',
                'description' => 'Effectuez un paiement via diverses plateformes de Mobile Money. Cette méthode ne nécessite pas d\'adresse à copier. Pour effectuer le paiement, contactez directement notre support.',
            ],
        ]);
    }
}
