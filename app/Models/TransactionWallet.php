<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionWallet extends Model
{
    use HasFactory;

    /**
     * Attributs pouvant être remplis en masse.
     */
    protected $fillable = [
        'transaction_id',  // ID de la transaction associée
        'withdrawal_method',  // Méthode de retrait (Perfect Money, Bitcoin, etc.)
        'account_or_wallet',  // Compte ou wallet
    ];

    /**
     * Relation avec la table Transaction.
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
