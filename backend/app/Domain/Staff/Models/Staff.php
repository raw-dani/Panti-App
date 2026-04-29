<?php

namespace App\Domain\Staff\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'phone',
        'address',
        'hire_date',
        'salary',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orphans(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Domain\Orphan\Models\Orphan::class);
    }

    public function donations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Domain\Donation\Models\Donation::class);
    }

    public function attendances(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StaffAttendance::class);
    }

    public function payrolls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StaffPayroll::class);
    }

    public function performanceReviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StaffPerformanceReview::class);
    }
}

