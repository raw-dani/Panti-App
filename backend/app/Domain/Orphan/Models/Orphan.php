<?php

namespace App\Domain\Orphan\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Domain\Staff\Models\Staff;

class Orphan extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'gender',
        'birth_date',
        'religion',
        'address_origin',
        'parent_status',
        'entry_date',
        'health_notes',
        'education_level',
        'photo',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'entry_date' => 'date',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function adoptions(): HasMany
    {
        return $this->hasMany(\App\Domain\Adoption\Models\Adoption::class);
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(OrphanMedicalRecord::class);
    }

    public function educationRecords(): HasMany
    {
        return $this->hasMany(OrphanEducationRecord::class);
    }

    public function familyContacts(): HasMany
    {
        return $this->hasMany(OrphanFamilyContact::class);
    }
}

