<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',           // Référence à l'utilisateur
        'bot_id',            // Référence au bot
        'subscription_date', // Date de souscription
        'expiration_date',   // Date d'expiration
    ];

    // Relation avec le modèle User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le modèle Bot
    public function bot()
    {
        return $this->belongsTo(TradingBot::class);
    }
}
