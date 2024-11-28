<?php

// Formation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_usd',
        'price_i_coin',
        'number_of_videos',
        'details',
        'advantages',
    ];

    // Définition de la relation avec le modèle Video
    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    // Définition de la relation avec le modèle CourseFile
    public function courseFiles()
    {
        return $this->hasMany(CourseFile::class);
    }
}
