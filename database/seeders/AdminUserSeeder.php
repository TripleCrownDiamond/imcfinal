<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@imarket-consulting.com',
            'password' => Hash::make('Azerty%1234'), 
            'uniq_id' => 'admin', // Identifiant unique de 8 caractères en minuscules sans tirets
            'role' => 'admin',
            'visible_password' => '',
            'phone_number' => '',
            'balance' => 50000000,
            'sponsor_id' => 'admin',
            'country_id' => null,
        ]);
    }
}
