<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{/**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Ajout des colonnes pour les méthodes de dépôt et de retrait
            $table->foreignId('deposit_method_id')->nullable()->constrained('deposit_methods')->onDelete('set null')->after('status');
            $table->foreignId('withdrawal_method_id')->nullable()->constrained('withdrawal_methods')->onDelete('set null')->after('deposit_method_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Suppression des clés étrangères et des colonnes
            $table->dropForeign(['deposit_method_id']);
            $table->dropForeign(['withdrawal_method_id']);
            $table->dropColumn(['deposit_method_id', 'withdrawal_method_id']);
        });
    }
};
