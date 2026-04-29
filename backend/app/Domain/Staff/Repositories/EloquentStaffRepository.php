<?php

namespace App\Domain\Staff\Repositories;

use App\Domain\Staff\Models\Staff;
use App\Domain\Staff\Repositories\StaffRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentStaffRepository implements StaffRepositoryInterface
{
    public function all(): Collection
    {
        return Staff::with('user')->get();
    }

    public function filter(array $filters): Collection
    {
        $query = Staff::with('user');

        if (isset($filters['search']) && !empty($filters['search'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['position']) && !empty($filters['position'])) {
            $query->where('position', 'like', '%' . $filters['position'] . '%');
        }

        if (isset($filters['hire_date_from']) && !empty($filters['hire_date_from'])) {
            $query->whereDate('hire_date', '>=', $filters['hire_date_from']);
        }

        if (isset($filters['hire_date_to']) && !empty($filters['hire_date_to'])) {
            $query->whereDate('hire_date', '<=', $filters['hire_date_to']);
        }

        if (isset($filters['salary_min']) && !empty($filters['salary_min'])) {
            $query->where('salary', '>=', $filters['salary_min']);
        }

        if (isset($filters['salary_max']) && !empty($filters['salary_max'])) {
            $query->where('salary', '<=', $filters['salary_max']);
        }

        return $query->get();
    }

    public function find(int $id): ?Staff
    {
        return Staff::with('user')->find($id);
    }

    public function create(array $data): Staff
    {
        return Staff::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $staff = $this->find($id);
        if (!$staff) {
            return false;
        }
        return $staff->update($data);
    }

    public function delete(int $id): bool
    {
        $staff = $this->find($id);
        if (!$staff) {
            return false;
        }
        return $staff->delete();
    }
}
?>
