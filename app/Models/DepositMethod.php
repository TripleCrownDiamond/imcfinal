<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositMethod extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'deposit_method_id'); // 'deposit_method_id' fait référence à la clé étrangère dans Transaction
    }

    // Relation avec deposit_method_fields
    public function fields()
    {
        return $this->hasMany(DepositMethodField::class);
    }
}
