<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;
    // Indiquez les attributs que vous pouvez remplir
    protected $fillable = [
        'name',
        'code',
        'value_in_i_coin',
    ];

    public static function getAll()
    {
        return self::all(); // Récupère toutes les entrées de la table currencies
    }

}
