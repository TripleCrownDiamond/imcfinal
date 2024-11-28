<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TradingBotsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bots = [
            [
                'uniq_id' => Str::uuid(), // Génération d'un ID unique
                'name' => 'Guardian',
                'cost_icoin' => 23,
                'cost_usd' => 10.35,
                'duration_days' => 95,
                'minimum_deposit_icoin' => 100,
                'minimum_deposit_usd' => 45,
                'daily_profit_percentage' => 3.5,
                'profit_duration_days' => 45,
            ],
            [
                'uniq_id' => Str::uuid(), // Génération d'un ID unique
                'name' => 'Elite',
                'cost_icoin' => 112,
                'cost_usd' => 50.4,
                'duration_days' => 45,
                'minimum_deposit_icoin' => 445,
                'minimum_deposit_usd' => 200.25,
                'daily_profit_percentage' => 7.5,
                'profit_duration_days' => 20,
            ],
            [
                'uniq_id' => Str::uuid(), // Génération d'un ID unique
                'name' => 'Lunar',
                'cost_icoin' => 223,
                'cost_usd' => 100.35,
                'duration_days' => 35,
                'minimum_deposit_icoin' => 3334,
                'minimum_deposit_usd' => 1500.3,
                'daily_profit_percentage' => 12.5,
                'profit_duration_days' => 20,
            ],
            [
                'uniq_id' => Str::uuid(), // Génération d'un ID unique
                'name' => 'Infinity',
                'cost_icoin' => 1112,
                'cost_usd' => 500.4,
                'duration_days' => 25,
                'minimum_deposit_icoin' => 11112,
                'minimum_deposit_usd' => 5000.4,
                'daily_profit_percentage' => 25,
                'profit_duration_days' => 12,
            ],
        ];

        DB::table('trading_bots')->insert($bots);
    }
}
