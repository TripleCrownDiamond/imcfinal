<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('formation_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relation avec la table users
            $table->foreignId('formation_id')->constrained()->onDelete('cascade'); // Relation avec la table formations
            $table->timestamps();

            // Ajoutez une contrainte unique pour garantir qu'un utilisateur ne peut souscrire qu'une seule fois à la même formation
            $table->unique(['user_id', 'formation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_subscriptions');
    }
};
