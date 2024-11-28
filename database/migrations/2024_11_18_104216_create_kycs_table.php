<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKycsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kycs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Lien avec la table users
            $table->string('document_type'); // Type de document (passeport, carte d'identité, etc.)
            $table->string('document_path'); // Chemin du document téléchargé
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Statut du document
            $table->timestamps(); // Création des timestamps (created_at, updated_at)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kycs');
    }
}
