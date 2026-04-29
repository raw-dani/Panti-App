<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Staff\Services\StaffService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Domain\Staff\Models\Staff;

class StaffController extends Controller
{
    public function __construct(private StaffService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'hire_date_from' => 'nullable|date',
            'hire_date_to' => 'nullable|date|after_or_equal:hire_date_from',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
        ]);

        if (empty(array_filter($validated))) {
            $staff = $this->service->getAllStaff();
        } else {
            $staff = $this->service->getFilteredStaff($validated);
        }

        return response()->json($staff);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only admin can create new staff
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Only admin can create new staff members'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,staff',
            'position' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
        ]);

        // Create user first
        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Create staff record linked to the new user
        $staffData = [
            'user_id' => $user->id,
            'position' => $validated['position'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'hire_date' => $validated['hire_date'],
            'salary' => $validated['salary'],
        ];

        $staff = $this->service->createStaff($staffData);
        $staff->load('user');

        return response()->json($staff, 201);
    }

    public function show(int $id): JsonResponse
    {
        $staff = $this->service->getStaffById($id);
        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }
        return response()->json($staff);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $staff = $this->service->getStaffById($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        // Check role-based access control
        if ($user->role !== 'admin' && $user->role === 'staff') {
            // Staff can only edit themselves
            if ($staff->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized to edit this staff member'], 403);
            }
            // Staff cannot change roles
            if ($request->has('role')) {
                return response()->json(['message' => 'Staff cannot change user roles'], 403);
            }
        }

        $validated = $request->validate([
            'position' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'salary' => 'sometimes|numeric|min:0',
            'hire_date' => 'sometimes|date',
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|in:admin,staff',
        ]);

        if (!$this->service->updateStaff($id, $validated)) {
            return response()->json(['message' => 'Staff update failed'], 500);
        }
        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        // Only admin can delete staff
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Only admin can delete staff members'], 403);
        }

        if (!$this->service->deleteStaff($id)) {
            return response()->json(['message' => 'Staff not found'], 404);
        }
        return response()->json(['message' => 'Deleted']);
    }

    // Attendance
    public function attendances(int $staffId): JsonResponse
    {
        $records = $this->service->getAttendances($staffId);
        return response()->json($records);
    }

    public function storeAttendance(Request $request, int $staffId): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,leave,sick',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'notes' => 'nullable|string',
        ]);

        $record = $this->service->createAttendance($staffId, $validated);
        if (!$record) {
            return response()->json(['message' => 'Staff not found'], 404);
        }
        return response()->json($record, 201);
    }

    public function updateAttendance(Request $request, int $attendanceId): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:present,absent,late,leave,sick',
            'check_in' => 'sometimes|nullable|date_format:H:i',
            'check_out' => 'sometimes|nullable|date_format:H:i|after:check_in',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updateAttendance($attendanceId, $validated)) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }
        return response()->json(['message' => 'Attendance updated']);
    }

    public function destroyAttendance(int $attendanceId): JsonResponse
    {
        if (!$this->service->deleteAttendance($attendanceId)) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }
        return response()->json(['message' => 'Attendance deleted']);
    }

    // Payroll
    public function payrolls(int $staffId): JsonResponse
    {
        $records = $this->service->getPayrolls($staffId);
        return response()->json($records);
    }

    public function storePayroll(Request $request, int $staffId): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100',
            'base_salary' => 'required|numeric|min:0',
            'bonus' => 'sometimes|numeric|min:0',
            'deductions' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:draft,approved,paid',
            'paid_at' => 'sometimes|nullable|date',
            'notes' => 'nullable|string',
        ]);

        $record = $this->service->createPayroll($staffId, $validated);
        if (!$record) {
            return response()->json(['message' => 'Staff not found'], 404);
        }
        return response()->json($record, 201);
    }

    public function updatePayroll(Request $request, int $payrollId): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'sometimes|integer|min:1|max:12',
            'year' => 'sometimes|integer|min:2000|max:2100',
            'base_salary' => 'sometimes|numeric|min:0',
            'bonus' => 'sometimes|numeric|min:0',
            'deductions' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:draft,approved,paid',
            'paid_at' => 'sometimes|nullable|date',
            'notes' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updatePayroll($payrollId, $validated)) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }
        return response()->json(['message' => 'Payroll updated']);
    }

    public function destroyPayroll(int $payrollId): JsonResponse
    {
        if (!$this->service->deletePayroll($payrollId)) {
            return response()->json(['message' => 'Payroll not found'], 404);
        }
        return response()->json(['message' => 'Payroll deleted']);
    }

    // Performance Reviews
    public function performanceReviews(int $staffId): JsonResponse
    {
        $records = $this->service->getPerformanceReviews($staffId);
        return response()->json($records);
    }

    public function storePerformanceReview(Request $request, int $staffId): JsonResponse
    {
        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,id',
            'review_date' => 'required|date',
            'rating' => 'required|integer|min:1|max:5',
            'strengths' => 'nullable|string',
            'areas_for_improvement' => 'nullable|string',
            'goals' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $record = $this->service->createPerformanceReview($staffId, $validated);
        if (!$record) {
            return response()->json(['message' => 'Staff not found'], 404);
        }
        return response()->json($record, 201);
    }

    public function updatePerformanceReview(Request $request, int $reviewId): JsonResponse
    {
        $validated = $request->validate([
            'reviewer_id' => 'sometimes|exists:users,id',
            'review_date' => 'sometimes|date',
            'rating' => 'sometimes|integer|min:1|max:5',
            'strengths' => 'sometimes|nullable|string',
            'areas_for_improvement' => 'sometimes|nullable|string',
            'goals' => 'sometimes|nullable|string',
            'comments' => 'sometimes|nullable|string',
        ]);

        if (!$this->service->updatePerformanceReview($reviewId, $validated)) {
            return response()->json(['message' => 'Performance review not found'], 404);
        }
        return response()->json(['message' => 'Performance review updated']);
    }

    public function destroyPerformanceReview(int $reviewId): JsonResponse
    {
        if (!$this->service->deletePerformanceReview($reviewId)) {
            return response()->json(['message' => 'Performance review not found'], 404);
        }
        return response()->json(['message' => 'Performance review deleted']);
    }
}

