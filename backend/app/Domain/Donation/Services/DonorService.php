<?php

namespace App\Domain\Donation\Services;

use App\Domain\Donation\Repositories\DonorRepositoryInterface;
use App\Models\Donor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class DonorService
{
    public function __construct(
        protected DonorRepositoryInterface $donorRepository
    ) {}

    public function getAll(?string $search = null, ?bool $isActive = null): Collection
    {
        return $this->donorRepository->all($search, $isActive);
    }

    public function find(int $id): ?Donor
    {
        $donor = $this->donorRepository->find($id);
        if (!$donor) {
            throw ValidationException::withMessages(['id' => 'Donor not found']);
        }
        return $donor;
    }

    public function create(array $data): Donor
    {
        return $this->donorRepository->create($data);
    }

    public function update(int $id, array $data): Donor
    {
        $donor = $this->find($id);
        $this->donorRepository->update($id, $data);
        return $donor->fresh();
    }

    public function delete(int $id): void
    {
        $donor = $this->find($id);
        
        // Check if donor has donations
        if ($donor->donations()->exists()) {
            throw ValidationException::withMessages([
                'id' => 'Cannot delete donor with existing donations. Consider deactivating instead.'
            ]);
        }
        
        $this->donorRepository->delete($id);
    }

    public function getDonationStats(int $donorId): array
    {
        $donor = $this->find($donorId);
        $stats = $donor->donations()
            ->selectRaw('COUNT(*) as total_donations, SUM(amount) as total_amount')
            ->first();

        return [
            'total_donations' => $stats->total_donations ?? 0,
            'total_amount' => $stats->total_amount ?? 0,
        ];
    }
}

