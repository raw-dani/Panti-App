<?php

namespace App\Domain\Donation\Repositories;

use App\Domain\Donation\Repositories\DonorRepositoryInterface;
use App\Models\Donor;
use Illuminate\Database\Eloquent\Collection;

class EloquentDonorRepository implements DonorRepositoryInterface
{
    protected Donor $model;

    public function __construct(Donor $model)
    {
        $this->model = $model;
    }

    public function all(?string $search = null, ?bool $isActive = null): Collection
    {
        $query = $this->model->newQuery();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        return $query->orderBy('name')->get();
    }

    public function find(int $id): ?Donor
    {
        return $this->model->find($id);
    }

    public function create(array $data): Donor
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $donor = $this->find($id);
        if (!$donor) {
            return false;
        }

        return $donor->update($data);
    }

    public function delete(int $id): bool
    {
        $donor = $this->find($id);
        if (!$donor) {
            return false;
        }

        return $donor->delete();
    }
}

