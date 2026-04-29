<?php

namespace App\Domain\Donation\Repositories;

use App\Domain\Donation\Models\Donation;
use Illuminate\Database\Eloquent\Collection;

class EloquentDonationRepository implements DonationRepositoryInterface
{
    public function all(): Collection
    {
        return Donation::with('staff.user')->get();
    }

    public function find(int $id): ?Donation
    {
        return Donation::with('staff.user')->find($id);
    }

    public function create(array $data): Donation
    {
        return Donation::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $donation = Donation::find($id);
        if (!$donation) {
            return false;
        }
        
        return $donation->update($data);
    }

    public function delete(int $id): bool
    {
        $donation = Donation::find($id);
        if (!$donation) {
            return false;
        }
        
        return $donation->delete();
    }

    public function filter(array $filters): Collection
    {
        $query = Donation::with('staff.user');
        
        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('donor_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('donor_email', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }
        
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        if (isset($filters['date_from'])) {
            $query->where('date_received', '>=', $filters['date_from']);
        }
        
        if (isset($filters['date_to'])) {
            $query->where('date_received', '<=', $filters['date_to']);
        }
        
        if (isset($filters['amount_min'])) {
            $query->where('amount', '>=', $filters['amount_min']);
        }
        
        if (isset($filters['amount_max'])) {
            $query->where('amount', '<=', $filters['amount_max']);
        }
        
        return $query->get();
    }
}