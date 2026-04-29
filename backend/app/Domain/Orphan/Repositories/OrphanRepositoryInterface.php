<?php

namespace App\Domain\Orphan\Repositories;

use App\Domain\Orphan\Models\Orphan;
use Illuminate\Database\Eloquent\Collection;

interface OrphanRepositoryInterface
{
    public function all(): Collection;
    public function filter(array $filters): Collection;
    public function find(int $id): ?Orphan;
    public function create(array $data): Orphan;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function upcomingBirthdays(int $days = 30): Collection;
}
?>

