<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepositMethodFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Méthode de dépôt : Bitcoin
        $bitcoin = DB::table('deposit_methods')->where('name', 'Bitcoin')->first();
        DB::table('deposit_method_fields')->insert([
            [
                'deposit_method_id' => $bitcoin->id,
                'field_name' => 'Wallet Adresse',
                'field_type' => 'text',
                'field_value' => '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            ],
        ]);

        // Méthode de dépôt : USDT
        $usdt = DB::table('deposit_methods')->where('name', 'USDT')->first();
        DB::table('deposit_method_fields')->insert([
            [
                'deposit_method_id' => $usdt->id,
                'field_name' => 'Wallet Adresse',
                'field_type' => 'text',
                'field_value' => '0x47eadD7a2bCe06B8D4e69D8cFd5EC4136DDA2F64',
            ],
        ]);

        // Méthode de dépôt : Perfect Money
        $perfectMoney = DB::table('deposit_methods')->where('name', 'Perfect Money')->first();
        DB::table('deposit_method_fields')->insert([
            [
                'deposit_method_id' => $perfectMoney->id,
                'field_name' => 'Wallet Adresse',
                'field_type' => 'text',
                'field_value' => 'U1234567',
            ],
        ]);

        // Méthode de dépôt : Mobile Money
        $mobileMoney = DB::table('deposit_methods')->where('name', 'Mobile Money')->first();
        DB::table('deposit_method_fields')->insert([
            [
                'deposit_method_id' => $mobileMoney->id,
                'field_name' => 'Instructions',
                'field_type' => 'text',
                'field_value' => 'Contactez le support pour finaliser votre paiement.',
            ],
        ]);

        // Méthode de dépôt : MasterCard
        $masterCard = DB::table('deposit_methods')->where('name', 'MasterCard')->first();
        DB::table('deposit_method_fields')->insert([
            [
                'deposit_method_id' => $masterCard->id,
                'field_name' => 'Instructions',
                'field_type' => 'text',
                'field_value' => 'Contactez le support pour finaliser votre paiement.',
            ],
        ]);
    }
}
