<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * Indique les attributs pouvant être remplis en masse.
     */
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'status',
        'receiver_username',
        'amount_deducted',
        'amount_credited',
        'deposit_method_id',
        'withdrawal_method_id'
    ];

    /**
     * Attributs ayant des valeurs par défaut
     */
    protected $attributes = [
        'status' => 'pending',
        'amount_deducted' => false,
        'amount_credited' => false
    ];

    /**
     * La relation entre Transaction et User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Ajoutez la relation avec l'utilisateur (expéditeur)
    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Ajoutez la relation avec le destinataire (si nécessaire)
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_username', 'username');
    }

    public function withdrawalMethod()
    {
        return $this->belongsTo(WithdrawalMethod::class, 'withdrawal_method_id');
    }

    public function transactionWallet()
    {
        return $this->hasOne(TransactionWallet::class, 'transaction_id');
    }

    public function depositMethod()
    {
        return $this->belongsTo(DepositMethod::class, 'deposit_method_id');
    }
}
