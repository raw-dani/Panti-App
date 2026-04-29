<?php

namespace App\Domain\Event\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domain\Staff\Models\Staff;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'date',
        'venue',
        'description',
        'budget',
        'staff_id',
    ];

    protected $casts = [
        'date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}

