<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = ['formation_id', 'link'];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}
