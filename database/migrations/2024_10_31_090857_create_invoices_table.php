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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // Numéro de facture unique
            $table->string('user_uniq_id'); // Changez-le en string si uniq_id dans users est une chaîne
            $table->foreign('user_uniq_id')->references('uniq_id')->on('users')->onDelete('cascade'); // Ajoutez la contrainte ici
            // ... autres colonnes
            $table->unsignedBigInteger('product_id'); // ID du produit
            $table->string('product_type'); // Type du produit (course, tradingbot, etc.)
            $table->unsignedBigInteger('payment_method'); // ID de la méthode de paiement
            $table->string('status')->default('pending'); // Statut de la facture (paid, pending, canceled, etc.)
            $table->json('billing_details'); // Détails de facturation sous forme de JSON
            $table->date('invoice_date'); // Date de facturation
            $table->timestamp('paid_at')->nullable(); // Date de paiement
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
