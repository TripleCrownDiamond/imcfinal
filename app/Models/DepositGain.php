<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositGain extends Model
{
    use HasFactory;

    protected $fillable = [
        'trading_deposit_id',
        'gain_amount',
    ];

    public function tradingDeposit()
    {
        return $this->belongsTo(TradingDeposit::class);
    }
}
