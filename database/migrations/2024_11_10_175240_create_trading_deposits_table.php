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
        Schema::create('trading_deposits', function (Blueprint $table) {
            $table->id();
            $table->string('uniq_id')->unique(); // Unique ID pour chaque dépôt
            $table->decimal('amount', 15, 2); // Montant du dépôt
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Référence vers l'utilisateur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trading_deposits');
    }
};
