<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Donation\Services\DonorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class DonorController extends Controller
{
    public function __construct(protected DonorService $donorService)
    {
    }

    /**
     * Display a listing of donors.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'is_active' => 'nullable',
        ]);

        // Konversi string boolean dari frontend ke tipe boolean asli
        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $donors = $this->donorService->getAll($validated['search'] ?? null, $validated['is_active'] ?? null);

        return response()->json($donors);
    }

    /**
     * Store a newly created donor in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|string|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
                'tax_id' => 'nullable|string|max:50|unique:donors',
                'preferred_contact_method' => 'nullable|in:email,phone,mail',
                'notes' => 'nullable|string',
                'is_active' => 'nullable|boolean',
            ]);

            $donor = $this->donorService->create($validated);

            return response()->json($donor, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified donor.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $donor = $this->donorService->find($id);
            $stats = $this->donorService->getDonationStats($id);
            $donor->total_donations = $stats['total_donations'];
            $donor->total_amount = $stats['total_amount'];
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        return response()->json($donor);
    }

    /**
     * Update the specified donor in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'nullable|string|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
                'tax_id' => 'nullable|string|max:50|unique:donors,tax_id,' . $id,
                'preferred_contact_method' => 'nullable|in:email,phone,mail',
                'notes' => 'nullable|string',
                'is_active' => 'sometimes|boolean',
            ]);

            $donor = $this->donorService->update($id, $validated);

            return response()->json($donor);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified donor from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->donorService->delete($id);
            return response()->json(['message' => 'Donor deleted successfully']);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->status ?? 409);
        }
    }
}

