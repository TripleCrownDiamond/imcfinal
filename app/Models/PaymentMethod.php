<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    // Spécifiez les attributs qui peuvent être assignés en masse
    protected $fillable = [
        'uniq_id',
        'name',
        'description',
        'is_active',
    ];
}
