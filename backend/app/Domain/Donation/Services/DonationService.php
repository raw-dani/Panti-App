<?php

namespace App\Domain\Donation\Services;

use App\Domain\Donation\Repositories\DonationRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class DonationService
{
    protected $repository;

    public function __construct(DonationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllDonations()
    {
        return $this->repository->all();
    }

    public function getDonationById(int $id)
    {
        return $this->repository->find($id);
    }

    public function createDonation(array $data)
    {
        // Ensure staff_id is set from authenticated user if not provided
        if (!isset($data['staff_id'])) {
            $user = Auth::user();
            if ($user && isset($user->staff->id)) {
                $data['staff_id'] = $user->staff->id;
            }
        }
        
        return $this->repository->create($data);
    }

    public function updateDonation(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteDonation(int $id)
    {
        return $this->repository->delete($id);
    }

    public function filterDonations(array $filters)
    {
        return $this->repository->filter($filters);
    }

    public function generateReceiptNo()
    {
        // Generate a unique receipt number like DON-YYYYMMDD-XXXX
        $date = now()->format('Ymd');
        $lastDonation = \App\Domain\Donation\Models\Donation::where('receipt_no', 'like', "DON-{$date}-%")
            ->orderBy('receipt_no', 'desc')
            ->first();

        $sequence = 1;
        if ($lastDonation) {
            $lastSequence = (int)explode('-', $lastDonation->receipt_no)[2];
            $sequence = $lastSequence + 1;
        }

        return sprintf('DON-%s-%04d', $date, $sequence);
    }
}