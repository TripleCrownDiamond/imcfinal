<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorGain extends Model
{
    use HasFactory;

    protected $fillable = [
        'sponsor_uniq_id',
        'buyer_uniq_id',
        'product_cost',
        'gain_amount',
    ];



    /**
     * Relation avec les achats effectués par cet utilisateur (si applicable).
     */

    public function sponsor()
    {
        return $this->belongsTo(User::class, 'sponsor_uniq_id', 'uniq_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_uniq_id', 'uniq_id');
    }
}
