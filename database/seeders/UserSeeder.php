<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Créer le premier utilisateur avec 'sponsor_id' égal à "admin"
        $firstUser = User::factory()->create([
            'sponsor_id' => 'admin',  // Premier utilisateur avec sponsor "admin"
        ]);

        // Créer les autres utilisateurs en associant le sponsor_id du premier utilisateur
        User::factory(49)->create([
            'sponsor_id' => $firstUser->uniq_id,  // Les autres utilisateurs auront le sponsor_id du premier
        ]);
    }
}
