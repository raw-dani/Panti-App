<?php

namespace App\Domain\Staff\Services;

use App\Domain\Staff\Models\Staff;
use App\Domain\Staff\Models\StaffAttendance;
use App\Domain\Staff\Models\StaffPayroll;
use App\Domain\Staff\Models\StaffPerformanceReview;
use App\Domain\Staff\Repositories\StaffRepositoryInterface;

class StaffService
{
    public function __construct(private StaffRepositoryInterface $repository)
    {
    }

    public function getAllStaff(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function getFilteredStaff(array $filters): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->filter($filters);
    }

    public function getStaffById(int $id): ?Staff
    {
        return $this->repository->find($id);
    }

    public function createStaff(array $data): Staff
    {
        return $this->repository->create($data);
    }

    public function updateStaff(int $id, array $data): bool
    {
        $staff = $this->repository->find($id);
        if (!$staff) return false;

        // Handle user-related updates (password, role)
        if (isset($data['password']) || isset($data['role'])) {
            $userData = [];
            if (isset($data['password']) && !empty($data['password'])) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
            }
            if (isset($data['role'])) {
                $userData['role'] = $data['role'];
            }

            if (!empty($userData)) {
                $staff->user->update($userData);
            }

            // Remove user fields from staff data
            unset($data['password'], $data['role']);
        }

        // Update staff data
        if (!empty($data)) {
            return $this->repository->update($id, $data);
        }

        return true;
    }

    public function deleteStaff(int $id): bool
    {
        return $this->repository->delete($id);
    }

    // Attendance
    public function getAttendances(int $staffId): \Illuminate\Database\Eloquent\Collection
    {
        $staff = $this->repository->find($staffId);
        return $staff ? $staff->attendances()->latest('date')->get() : collect();
    }

    public function createAttendance(int $staffId, array $data): ?StaffAttendance
    {
        $staff = $this->repository->find($staffId);
        if (!$staff) return null;
        $data['staff_id'] = $staffId;
        return StaffAttendance::create($data);
    }

    public function updateAttendance(int $attendanceId, array $data): bool
    {
        $attendance = StaffAttendance::find($attendanceId);
        if (!$attendance) return false;
        return $attendance->update($data);
    }

    public function deleteAttendance(int $attendanceId): bool
    {
        $attendance = StaffAttendance::find($attendanceId);
        if (!$attendance) return false;
        return $attendance->delete();
    }

    // Payroll
    public function getPayrolls(int $staffId): \Illuminate\Database\Eloquent\Collection
    {
        $staff = $this->repository->find($staffId);
        return $staff ? $staff->payrolls()->latest('year')->latest('month')->get() : collect();
    }

    public function createPayroll(int $staffId, array $data): ?StaffPayroll
    {
        $staff = $this->repository->find($staffId);
        if (!$staff) return null;
        $data['staff_id'] = $staffId;
        $data['total'] = ($data['base_salary'] ?? 0) + ($data['bonus'] ?? 0) - ($data['deductions'] ?? 0);
        return StaffPayroll::create($data);
    }

    public function updatePayroll(int $payrollId, array $data): bool
    {
        $payroll = StaffPayroll::find($payrollId);
        if (!$payroll) return false;
        if (isset($data['base_salary']) || isset($data['bonus']) || isset($data['deductions'])) {
            $data['total'] = ($data['base_salary'] ?? $payroll->base_salary)
                + ($data['bonus'] ?? $payroll->bonus)
                - ($data['deductions'] ?? $payroll->deductions);
        }
        return $payroll->update($data);
    }

    public function deletePayroll(int $payrollId): bool
    {
        $payroll = StaffPayroll::find($payrollId);
        if (!$payroll) return false;
        return $payroll->delete();
    }

    // Performance Reviews
    public function getPerformanceReviews(int $staffId): \Illuminate\Database\Eloquent\Collection
    {
        $staff = $this->repository->find($staffId);
        return $staff ? $staff->performanceReviews()->latest('review_date')->get() : collect();
    }

    public function createPerformanceReview(int $staffId, array $data): ?StaffPerformanceReview
    {
        $staff = $this->repository->find($staffId);
        if (!$staff) return null;
        $data['staff_id'] = $staffId;
        return StaffPerformanceReview::create($data);
    }

    public function updatePerformanceReview(int $reviewId, array $data): bool
    {
        $review = StaffPerformanceReview::find($reviewId);
        if (!$review) return false;
        return $review->update($data);
    }

    public function deletePerformanceReview(int $reviewId): bool
    {
        $review = StaffPerformanceReview::find($reviewId);
        if (!$review) return false;
        return $review->delete();
    }
}
?>
