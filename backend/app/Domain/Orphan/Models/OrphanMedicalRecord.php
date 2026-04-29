<?php

namespace App\Domain\Orphan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrphanMedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'orphan_id',
        'date',
        'doctor_name',
        'description',
        'diagnosis',
        'treatment',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function orphan(): BelongsTo
    {
        return $this->belongsTo(Orphan::class);
    }
}

