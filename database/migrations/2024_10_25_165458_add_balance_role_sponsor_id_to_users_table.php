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
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('balance', 10, 2)->default(0)->after('email'); // Champ monétaire
            $table->string('role')->default('user')->after('balance'); // Rôle de l'utilisateur
            $table->string('sponsor_id')->nullable()->after('role'); // ID du sponsor
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['balance', 'role', 'sponsor_id']);
        });
    }
};
