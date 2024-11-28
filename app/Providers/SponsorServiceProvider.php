<?php

namespace App\Providers;

use App\Services\SponsorService;
use Illuminate\Support\ServiceProvider;

class SponsorServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SponsorService::class, function ($app) {
            return new SponsorService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
