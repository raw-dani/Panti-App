<?php

namespace App\Domain\Donation\Repositories;

use App\Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Collection;

interface DonationRepositoryInterface
{
    public function all(): Collection;

    public function find(int $id): ?Donation;

    public function create(array $data): Donation;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function filter(array $filters): Collection;
}