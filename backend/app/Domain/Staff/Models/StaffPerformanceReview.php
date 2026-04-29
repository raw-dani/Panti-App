<?php

namespace App\Domain\Staff\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffPerformanceReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'reviewer_id',
        'review_date',
        'rating',
        'strengths',
        'areas_for_improvement',
        'goals',
        'comments',
    ];

    protected $casts = [
        'review_date' => 'date',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'reviewer_id');
    }
}

