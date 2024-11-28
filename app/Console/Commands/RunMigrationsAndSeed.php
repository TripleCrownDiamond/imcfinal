<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RunMigrationsAndSeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:full'; // Nom de la commande
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh, migrate, and seed the database'; // Description de la commande

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Refreshing the database...');
        Artisan::call('migrate:fresh'); // Supprime toutes les tables et relance les migrations
        
        $this->info('Seeding the database...');
        Artisan::call('db:seed'); // Exécute les seeders

        $this->info('All operations completed successfully!');
    }
}
