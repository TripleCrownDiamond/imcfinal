<?php

namespace App\Console;

use App\Console\Commands\CalculateDailyProfits;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        CalculateDailyProfits::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        // Exécute la commande quotidiennement
        $schedule->command('profits:calculate-daily')->everyMinute();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
    }
}
