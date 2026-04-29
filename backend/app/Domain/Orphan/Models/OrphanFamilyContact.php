<?php

namespace App\Domain\Orphan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrphanFamilyContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'orphan_id',
        'name',
        'relationship',
        'phone',
        'address',
        'email',
        'is_primary_contact',
        'notes',
    ];

    protected $casts = [
        'is_primary_contact' => 'boolean',
    ];

    public function orphan(): BelongsTo
    {
        return $this->belongsTo(Orphan::class);
    }
}

