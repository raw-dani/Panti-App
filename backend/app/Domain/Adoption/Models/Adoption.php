<?php

namespace App\Domain\Adoption\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domain\Orphan\Models\Orphan;
use App\Domain\Staff\Models\Staff;

class Adoption extends Model
{
    use HasFactory;

    protected $fillable = [
        'orphan_id',
        'adopter_name',
        'adopter_phone',
        'adopter_email',
        'relationship',
        'approval_date',
        'status',
        'staff_id',
    ];

    protected $casts = [
        'approval_date' => 'date',
    ];

    public function orphan(): BelongsTo
    {
        return $this->belongsTo(Orphan::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}

