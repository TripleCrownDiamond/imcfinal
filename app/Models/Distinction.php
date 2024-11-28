<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Distinction extends Model
{
    // Fields that can be mass-assigned
    protected $fillable = [
        'name',
        'description',
        'min_icoin',
        'percentage_1',
        'percentage_2',
        'percentage_3',
        'percentage_4',
        'training_access'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_distinctions')
                    ->withPivot('date_acquired')
                    ->withTimestamps();
    }
}
