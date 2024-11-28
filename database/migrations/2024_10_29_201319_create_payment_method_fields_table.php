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
        Schema::create('payment_method_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_method_id')->constrained()->onDelete('cascade'); // Lien avec la méthode de paiement
            $table->string('field_name'); // Nom du champ
            $table->string('field_description')->nullable(); // Description du champ
            $table->string('value')->nullable(); // Valeur du champ
            $table->boolean('is_required')->default(true); // Si le champ est requis
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_method_fields');
    }
};
