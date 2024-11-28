<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Distinction;
use App\Models\Country;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'username' => $this->faker->unique()->userName,
            'country_id' => $this->faker->numberBetween(1, 3), // Remplacez avec une valeur valide pour le pays
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // Utilisez une méthode de hachage appropriée
            'uniq_id' => $this->faker->uuid,
            'balance' => $this->faker->numberBetween(0, 1000), // Balance fictive entre 0 et 1000
            'sponsor_id' => User::factory(), // Génère un sponsor aléatoire, vous pouvez personnaliser cela
            'role' => 'user', // Rôle par défaut pour ces utilisateurs
            'visible_password' => bcrypt('password'), // Pour stocker le mot de passe visible si nécessaire
            'phone_number' => $this->faker->phoneNumber, // Numéro de téléphone fictif
        ];
    }

    
}
