<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Distinction;
use App\Models\User;

class UserDistinction extends Model
{
    use HasFactory;

    protected $table = 'user_distinctions';

    protected $fillable = [
        'user_id',
        'distinction_id',
        'date_acquired',
    ];

    // Relation avec le modèle User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le modèle Distinction
    public function distinction()
    {
        return $this->belongsTo(Distinction::class);
    }
}
