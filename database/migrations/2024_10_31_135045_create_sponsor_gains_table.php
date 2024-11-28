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
        Schema::create('sponsor_gains', function (Blueprint $table) {
            $table->id();
            $table->string('sponsor_uniq_id');      // L'identifiant unique du sponsor
            $table->string('buyer_uniq_id');        // L'identifiant unique de l'acheteur
            $table->decimal('product_cost', 10, 2); // Montant du produit
            $table->decimal('gain_amount', 10, 2);  // Montant du gain attribué au sponsor
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsor_gains');
    }
};
