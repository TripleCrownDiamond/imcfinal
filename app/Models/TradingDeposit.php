<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TradingDeposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'uniq_id',
        'amount',
        'user_id',
        'subscription_id',  // Ajout de la nouvelle colonne
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gains()
    {
        return $this->hasMany(DepositGain::class);
    }
}
