<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class CommandController extends Controller
{
   

    public function executeProfitCalculation()
    {
       
        $exitCode = Artisan::call('profits:calculate-daily');
    
        if ($exitCode === 0) {
            session()->flash('flash.success', 'Calcul des profits lancé avec succès.');
        } else {
            session()->flash('flash.error', 'Erreur lors du calcul des profits.');
        }        
    
        return redirect()->back();
    }
}
