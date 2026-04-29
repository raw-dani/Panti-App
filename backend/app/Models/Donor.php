<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'tax_id',
        'preferred_contact_method',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tax_id' => 'string',
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
