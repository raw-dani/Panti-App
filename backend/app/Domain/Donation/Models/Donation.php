<?php

namespace App\Domain\Donation\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domain\Staff\Models\Staff;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_name',
        'donor_email',
        'donor_phone',
        'amount',
        'type',
        'description',
        'receipt_no',
        'date_received',
        'staff_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date_received' => 'date',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}

