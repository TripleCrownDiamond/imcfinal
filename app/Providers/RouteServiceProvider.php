<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Le chemin par défaut pour l'accueil de votre application.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Déclarez les routes de l'application.
     *
     * @return void
     */
    public function boot()
    {
        $this->routes(function () {
            // Configuration des routes pour l'API
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Configuration des routes web
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
