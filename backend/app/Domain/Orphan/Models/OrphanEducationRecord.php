<?php

namespace App\Domain\Orphan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrphanEducationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'orphan_id',
        'school_name',
        'grade_class',
        'academic_year',
        'semester',
        'status',
        'notes',
    ];

    public function orphan(): BelongsTo
    {
        return $this->belongsTo(Orphan::class);
    }
}

