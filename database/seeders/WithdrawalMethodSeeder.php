<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WithdrawalMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Insertion des méthodes de retrait
        DB::table('withdrawal_methods')->insert([
            [
                'name' => 'Perfect Money',
                'description' => 'Retrait via Perfect Money, une plateforme de paiement en ligne permettant d\'effectuer des retraits et des transferts internationaux.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'USDT',
                'description' => 'Retrait en USDT (Tether), une cryptomonnaie stable, permettant un transfert rapide et sécurisé vers votre portefeuille numérique.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bitcoin',
                'description' => 'Retrait en Bitcoin, la cryptomonnaie la plus populaire, permettant de transférer des fonds de manière décentralisée et sécurisée.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mobile Money',
                'description' => 'Retrait via Mobile Money, une méthode de paiement mobile populaire dans plusieurs pays africains, permettant de retirer de l\'argent directement depuis un téléphone portable.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
