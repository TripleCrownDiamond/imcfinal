<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(CountrySeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(TradingBotsSeeder::class);
        //$this->call(UserSeeder::class);
        $this->call(SubscriptionSeeder::class);
        $this->call(FormationsTableSeeder::class);
        $this->call(DistinctionsTableSeeder::class);
        $this->call(PaymentMethodsSeeder::class);
        $this->call(WithdrawalMethodSeeder::class);
        $this->call(DepositMethodSeeder::class);
        $this->call(DepositMethodFieldSeeder::class);
    }
}
