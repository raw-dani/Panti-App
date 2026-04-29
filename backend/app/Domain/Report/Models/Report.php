<?php

namespace App\Domain\Report\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domain\Staff\Models\Staff;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'period',
        'generated_by',
        'file_path',
        'staff_id',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}

