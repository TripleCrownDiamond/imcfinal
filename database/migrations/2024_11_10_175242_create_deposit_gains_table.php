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
        Schema::create('deposit_gains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trading_deposit_id')->constrained('trading_deposits')->onDelete('cascade'); // Clé étrangère vers le dépôt
            $table->decimal('gain_amount', 15, 2); // Montant du gain
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deposit_gains');
    }
};
