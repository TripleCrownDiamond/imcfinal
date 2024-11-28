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
        Schema::create('distinctions', function (Blueprint $table) {
            $table->id(); // Distinction ID
            $table->string('name'); // Distinction name
            $table->text('description'); // Distinction description
            $table->integer('min_icoin'); // Minimum I-Coin required
            $table->integer('percentage_1'); // Percentage for level 1
            $table->integer('percentage_2'); // Percentage for level 2
            $table->integer('percentage_3'); // Percentage for level 3
            $table->integer('percentage_4'); // Percentage for level 4
            $table->string('training_access')->nullable(); // Training access
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distinctions');
    }
};
