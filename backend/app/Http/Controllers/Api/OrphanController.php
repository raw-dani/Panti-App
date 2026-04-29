<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Orphan\Services\OrphanService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrphanController extends Controller
{
    public function __construct(private OrphanService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'status' => 'nullable|in:active,inactive',
            'entry_date_from' => 'nullable|date',
            'entry_date_to' => 'nullable|date|after_or_equal:entry_date_from',
        ]);

        if (empty(array_filter($validated))) {
            $orphans = $this->service->getAllOrphans();
        } else {
            $orphans = $this->service->getFilteredOrphans($validated);
        }

        return response()->json($orphans);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'gender' => 'required|in:male,female',
                'birth_date' => 'required|date',
                'religion' => 'required|string',
                'parent_status' => 'required|string',
                'entry_date' => 'required|date',
                'status' => 'sometimes|in:active,inactive',
                'address_origin' => 'nullable|string',
                'health_notes' => 'nullable|string',
                'education_level' => 'nullable|string',
            'photo' => 'sometimes|nullable|image|max:2048',
            ]);

            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')->store('orphans', 'public');
            }

            $orphan = $this->service->createOrphan($validated);
            return response()->json($orphan, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'files' => $request->allFiles()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }


    public function show(int $id): JsonResponse
    {
        $orphan = $this->service->getOrphanById($id);
        if (!$orphan) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json($orphan);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female',
            'birth_date' => 'sometimes|date',
            'religion' => 'sometimes|string',
            'parent_status' => 'sometimes|string',
            'entry_date' => 'sometimes|date',
            'status' => 'sometimes|in:active,inactive',
            'address_origin' => 'sometimes|nullable|string',
            'health_notes' => 'sometimes|nullable|string',
            'education_level' => 'sometimes|nullable|string',
            'photo' => 'sometimes|nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $orphan = $this->service->getOrphanById($id);
            if ($orphan && $orphan->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($orphan->photo);
            }
            $validated['photo'] = $request->file('photo')->store('orphans', 'public');
        }

        if (!$this->service->updateOrphan($id, $validated)) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy(int $id): JsonResponse
    {
        if (!$this->service->deleteOrphan($id)) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json(['message' => 'Deleted']);
    }

    // Medical Records
    public function medicalRecords(int $orphanId): JsonResponse
    {
        $records = $this->service->getMedicalRecords($orphanId);
        return response()->json($records);
    }

    public function storeMedicalRecord(Request $request, int $orphanId): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'doctor_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $record = $this->service->createMedicalRecord($orphanId, $validated);
        if (!$record) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json($record, 201);
    }

    public function updateMedicalRecord(Request $request, int $recordId): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'sometimes|date',
            'doctor_name' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|string',
            'diagnosis' => 'sometimes|nullable|string',
            'treatment' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updateMedicalRecord($recordId, $validated)) {
            return response()->json(['message' => 'Medical record not found'], 404);
        }
        return response()->json(['message' => 'Medical record updated']);
    }

    public function destroyMedicalRecord(int $recordId): JsonResponse
    {
        if (!$this->service->deleteMedicalRecord($recordId)) {
            return response()->json(['message' => 'Medical record not found'], 404);
        }
        return response()->json(['message' => 'Medical record deleted']);
    }

    // Education Records
    public function educationRecords(int $orphanId): JsonResponse
    {
        $records = $this->service->getEducationRecords($orphanId);
        return response()->json($records);
    }

    public function storeEducationRecord(Request $request, int $orphanId): JsonResponse
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'grade_class' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
            'semester' => 'sometimes|in:1,2',
            'status' => 'sometimes|in:active,completed,dropped',
            'notes' => 'nullable|string',
        ]);

        $record = $this->service->createEducationRecord($orphanId, $validated);
        if (!$record) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json($record, 201);
    }

    public function updateEducationRecord(Request $request, int $recordId): JsonResponse
    {
        $validated = $request->validate([
            'school_name' => 'sometimes|string|max:255',
            'grade_class' => 'sometimes|string|max:255',
            'academic_year' => 'sometimes|string|max:255',
            'semester' => 'sometimes|in:1,2',
            'status' => 'sometimes|in:active,completed,dropped',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updateEducationRecord($recordId, $validated)) {
            return response()->json(['message' => 'Education record not found'], 404);
        }
        return response()->json(['message' => 'Education record updated']);
    }

    public function destroyEducationRecord(int $recordId): JsonResponse
    {
        if (!$this->service->deleteEducationRecord($recordId)) {
            return response()->json(['message' => 'Education record not found'], 404);
        }
        return response()->json(['message' => 'Education record deleted']);
    }

    // Family Contacts
    public function familyContacts(int $orphanId): JsonResponse
    {
        $contacts = $this->service->getFamilyContacts($orphanId);
        return response()->json($contacts);
    }

    public function storeFamilyContact(Request $request, int $orphanId): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'is_primary_contact' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $contact = $this->service->createFamilyContact($orphanId, $validated);
        if (!$contact) {
            return response()->json(['message' => 'Orphan not found'], 404);
        }
        return response()->json($contact, 201);
    }

    public function updateFamilyContact(Request $request, int $contactId): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'relationship' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string',
            'email' => 'sometimes|nullable|email|max:255',
            'is_primary_contact' => 'sometimes|boolean',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updateFamilyContact($contactId, $validated)) {
            return response()->json(['message' => 'Family contact not found'], 404);
        }
        return response()->json(['message' => 'Family contact updated']);
    }

    public function destroyFamilyContact(int $contactId): JsonResponse
    {
        if (!$this->service->deleteFamilyContact($contactId)) {
            return response()->json(['message' => 'Family contact not found'], 404);
        }
        return response()->json(['message' => 'Family contact deleted']);
    }

    public function upcomingBirthdays(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $orphans = $this->service->upcomingBirthdays((int) $days);
        return response()->json($orphans);
    }
}
?>

