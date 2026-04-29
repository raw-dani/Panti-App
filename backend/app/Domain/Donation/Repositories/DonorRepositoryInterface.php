<?php

namespace App\Domain\Donation\Repositories;

use App\Models\Donor;
use Illuminate\Database\Eloquent\Collection;

interface DonorRepositoryInterface
{
    /**
     * Get all donors with optional filters
     */
    public function all(?string $search = null, ?bool $isActive = null): Collection;

    /**
     * Find donor by ID
     */
    public function find(int $id): ?Donor;

    /**
     * Create new donor
     */
    public function create(array $data): Donor;

    /**
     * Update donor
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete donor
     */
    public function delete(int $id): bool;
}

