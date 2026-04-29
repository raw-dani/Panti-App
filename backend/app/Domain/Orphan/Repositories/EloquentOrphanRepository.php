<?php

namespace App\Domain\Orphan\Repositories;

use App\Domain\Orphan\Models\Orphan;
use App\Domain\Orphan\Repositories\OrphanRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentOrphanRepository implements OrphanRepositoryInterface
{
    public function all(): Collection
    {
        return Orphan::latest()->get();
    }

    public function filter(array $filters): Collection
    {
        $query = Orphan::query();

        // Search filter (name)
        if (isset($filters['search']) && !empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // Gender filter
        if (isset($filters['gender']) && !empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        // Status filter
        if (isset($filters['status']) && !empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Entry date filter (range)
        if (isset($filters['entry_date_from']) && !empty($filters['entry_date_from'])) {
            $query->whereDate('entry_date', '>=', $filters['entry_date_from']);
        }

        if (isset($filters['entry_date_to']) && !empty($filters['entry_date_to'])) {
            $query->whereDate('entry_date', '<=', $filters['entry_date_to']);
        }

        return $query->latest()->get();
    }

    public function find(int $id): ?Orphan
    {
        return Orphan::with(['staff', 'medicalRecords', 'educationRecords', 'familyContacts'])->find($id);
    }

    public function create(array $data): Orphan
    {
        return Orphan::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $orphan = $this->find($id);
        if (!$orphan) {
            return false;
        }
        return $orphan->update($data);
    }

    public function delete(int $id): bool
    {
        $orphan = $this->find($id);
        if (!$orphan) {
            return false;
        }
        return $orphan->delete();
    }

    public function upcomingBirthdays(int $days = 30): Collection
    {
        $today = now();
        $endDate = now()->addDays($days);

        return Orphan::where('status', 'active')
            ->get()
            ->filter(function ($orphan) use ($today, $endDate) {
                $birthdayThisYear = $orphan->birth_date->copy()->year($today->year);
                if ($birthdayThisYear->lt($today)) {
                    $birthdayThisYear->addYear();
                }
                return $birthdayThisYear->lte($endDate);
            })
            ->sortBy(function ($orphan) use ($today) {
                $birthdayThisYear = $orphan->birth_date->copy()->year($today->year);
                if ($birthdayThisYear->lt($today)) {
                    $birthdayThisYear->addYear();
                }
                return $birthdayThisYear;
            })
            ->values();
    }
}
?>

