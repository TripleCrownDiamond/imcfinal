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
        Schema::create('user_distinctions', function (Blueprint $table) {
            $table->id(); // Relationship ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User ID
            $table->foreignId('distinction_id')->constrained()->onDelete('cascade'); // Distinction ID
            $table->date('date_acquired')->nullable(); // Date of distinction acquisition
            $table->timestamps(); // created_at and updated_at columns

            // Ensure uniqueness of the distinction per user
            $table->unique(['user_id', 'distinction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_distinctions');
    }
};
