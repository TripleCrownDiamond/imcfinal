<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositMethodField extends Model
{
    use HasFactory;

    protected $fillable = ['deposit_method_id', 'field_name', 'field_type', "field_value"];

    // Définir le nom de la table si ce n'est pas "fields"
    protected $table = 'deposit_method_fields'; 

    // Relation inverse avec DepositMethod
    public function depositMethod()
    {
        return $this->belongsTo(DepositMethod::class);
    }
}
