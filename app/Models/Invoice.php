<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_uniq_id',
        'product_id',
        'product_type',
        'payment_method',
        'status',
        'billing_details',
        'invoice_date',
        'paid_at',
    ];

    protected $casts = [
        'billing_details' => 'array',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class, 'user_uniq_id', 'uniq_id');
    }

    // Relation avec le produit, qui peut être un cours ou un bot de trading
    public function product()
    {
        return $this->morphTo(__FUNCTION__, 'product_type', 'product_id');
    }

    // Relation avec la méthode de paiement
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method');
    }

    protected $dates = ['invoice_date', 'paid_at'];
}
