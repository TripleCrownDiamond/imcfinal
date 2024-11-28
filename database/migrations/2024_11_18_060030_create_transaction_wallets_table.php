<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionWalletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('transaction_wallets', function (Blueprint $table) {
            $table->id();  // ID unique pour chaque entrée
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');  // Clé étrangère vers la table 'transactions'
            $table->string('withdrawal_method');  // Méthode de retrait (par exemple : Perfect Money, Bitcoin)
            $table->string('account_or_wallet');  // Numéro de compte ou adresse de wallet
            $table->timestamps();  // Pour garder trace des dates de création et mise à jour
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_wallets');
    }
}
