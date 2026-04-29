<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Donation\Services\DonationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Domain\Donation\Models\Donation;

class DonationController extends Controller
{
    public function __construct(private DonationService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'type' => 'nullable|in:cash,goods',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'amount_min' => 'nullable|numeric|min:0',
            'amount_max' => 'nullable|numeric|min:0',
        ]);

        $filters = array_filter($validated);
        
        if (empty($filters)) {
            $donations = $this->service->getAllDonations();
        } else {
            $donations = $this->service->filterDonations($filters);
        }

        return response()->json($donations);
    }

    public function store(Request $request): JsonResponse
    {
        // Only admin and staff can create donations
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Unauthorized to create donations'], 403);
        }

        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'nullable|string|email|max:255',
            'donor_phone' => 'nullable|string|max:20',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:cash,goods',
            'description' => 'nullable|string',
            'date_received' => 'required|date',
        ]);

        // Generate receipt number if not provided
        if (!isset($validated['receipt_no'])) {
            $validated['receipt_no'] = $this->service->generateReceiptNo();
        }

        $donation = $this->service->createDonation($validated);
        $donation->load('staff.user');

        return response()->json($donation, 201);
    }

    public function show(int $id): JsonResponse
    {
        $donation = $this->service->getDonationById($id);
        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }
        
        return response()->json($donation);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        // Only admin and staff can update donations
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Unauthorized to update donations'], 403);
        }

        $donation = $this->service->getDonationById($id);
        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        $validated = $request->validate([
            'donor_name' => 'sometimes|string|max:255',
            'donor_email' => 'nullable|string|email|max:255',
            'donor_phone' => 'sometimes|string|max:20',
            'amount' => 'sometimes|numeric|min:0.01',
            'type' => 'sometimes|in:cash,goods',
            'description' => 'sometimes|string',
            'date_received' => 'sometimes|date',
        ]);

        $success = $this->service->updateDonation($id, $validated);
        if (!$success) {
            return response()->json(['message' => 'Donation update failed'], 500);
        }

        $updatedDonation = $this->service->getDonationById($id);
        $updatedDonation->load('staff.user');

        return response()->json($updatedDonation);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        // Only admin can delete donations
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Only admin can delete donations'], 403);
        }

        $success = $this->service->deleteDonation($id);
        if (!$success) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        return response()->json(['message' => 'Donation deleted']);
    }
}