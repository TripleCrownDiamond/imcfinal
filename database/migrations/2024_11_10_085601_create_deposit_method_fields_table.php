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
        Schema::create('deposit_method_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deposit_method_id')->constrained()->onDelete('cascade'); // Liaison avec la méthode de dépôt
            $table->string('field_name');
            $table->string('field_type');
            $table->string('field_value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deposit_method_fields');
    }
};
