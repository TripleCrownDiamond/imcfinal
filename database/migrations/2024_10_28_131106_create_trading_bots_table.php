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
        Schema::create('trading_bots', function (Blueprint $table) {
            $table->id();
            $table->string('uniq_id')->unique(); // Ajout du champ uniq_id
            $table->string('name');
            $table->decimal('cost_icoin', 10, 2); // Coût en I-Coin
            $table->decimal('cost_usd', 10, 2);  // Coût en USD
            $table->integer('duration_days');     // Durée en jours
            $table->decimal('minimum_deposit_icoin', 10, 2); // Dépôt minimum en I-Coin
            $table->decimal('minimum_deposit_usd', 10, 2);   // Dépôt minimum en USD
            $table->decimal('daily_profit_percentage', 5, 2); // Gains journaliers en pourcentage
            $table->integer('profit_duration_days'); // Durée des gains en jours
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trading_bots');
    }
};
