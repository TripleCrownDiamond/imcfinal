<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TradingBot extends Model
{
    use HasFactory;

    // Indiquez les colonnes que vous souhaitez remplir en masse
    protected $fillable = [
        'uniq_id',
        'name',
        'cost_icoin',
        'cost_usd',
        'duration_days',
        'minimum_deposit_icoin',
        'minimum_deposit_usd',
        'daily_profit_percentage',
        'profit_duration_days',
    ];

    // Si nécessaire, vous pouvez également définir des casts pour vos attributs
    protected $casts = [
        'cost_icoin' => 'decimal:2',
        'cost_usd' => 'decimal:2',
        'minimum_deposit_icoin' => 'decimal:2',
        'minimum_deposit_usd' => 'decimal:2',
        'daily_profit_percentage' => 'decimal:2',
    ];

    // Relation avec les abonnements
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
