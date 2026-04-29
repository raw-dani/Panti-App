<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Orphans & Staff API (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orphans', \App\Http\Controllers\Api\OrphanController::class);
    Route::apiResource('staff', \App\Http\Controllers\Api\StaffController::class);

    // Staff Attendance
    Route::get('/staff/{staff}/attendances', [\App\Http\Controllers\Api\StaffController::class, 'attendances']);
    Route::post('/staff/{staff}/attendances', [\App\Http\Controllers\Api\StaffController::class, 'storeAttendance']);
    Route::put('/attendances/{attendance}', [\App\Http\Controllers\Api\StaffController::class, 'updateAttendance']);
    Route::delete('/attendances/{attendance}', [\App\Http\Controllers\Api\StaffController::class, 'destroyAttendance']);

    // Staff Payroll
    Route::get('/staff/{staff}/payrolls', [\App\Http\Controllers\Api\StaffController::class, 'payrolls']);
    Route::post('/staff/{staff}/payrolls', [\App\Http\Controllers\Api\StaffController::class, 'storePayroll']);
    Route::put('/payrolls/{payroll}', [\App\Http\Controllers\Api\StaffController::class, 'updatePayroll']);
    Route::delete('/payrolls/{payroll}', [\App\Http\Controllers\Api\StaffController::class, 'destroyPayroll']);

    // Staff Performance Reviews
    Route::get('/staff/{staff}/performance-reviews', [\App\Http\Controllers\Api\StaffController::class, 'performanceReviews']);
    Route::post('/staff/{staff}/performance-reviews', [\App\Http\Controllers\Api\StaffController::class, 'storePerformanceReview']);
    Route::put('/performance-reviews/{review}', [\App\Http\Controllers\Api\StaffController::class, 'updatePerformanceReview']);
    Route::delete('/performance-reviews/{review}', [\App\Http\Controllers\Api\StaffController::class, 'destroyPerformanceReview']);

    // Medical Records
    Route::get('/orphans/{orphan}/medical-records', [\App\Http\Controllers\Api\OrphanController::class, 'medicalRecords']);
    Route::post('/orphans/{orphan}/medical-records', [\App\Http\Controllers\Api\OrphanController::class, 'storeMedicalRecord']);
    Route::put('/medical-records/{record}', [\App\Http\Controllers\Api\OrphanController::class, 'updateMedicalRecord']);
    Route::delete('/medical-records/{record}', [\App\Http\Controllers\Api\OrphanController::class, 'destroyMedicalRecord']);

    // Education Records
    Route::get('/orphans/{orphan}/education-records', [\App\Http\Controllers\Api\OrphanController::class, 'educationRecords']);
    Route::post('/orphans/{orphan}/education-records', [\App\Http\Controllers\Api\OrphanController::class, 'storeEducationRecord']);
    Route::put('/education-records/{record}', [\App\Http\Controllers\Api\OrphanController::class, 'updateEducationRecord']);
    Route::delete('/education-records/{record}', [\App\Http\Controllers\Api\OrphanController::class, 'destroyEducationRecord']);

    // Family Contacts
    Route::get('/orphans/{orphan}/family-contacts', [\App\Http\Controllers\Api\OrphanController::class, 'familyContacts']);
    Route::post('/orphans/{orphan}/family-contacts', [\App\Http\Controllers\Api\OrphanController::class, 'storeFamilyContact']);
    Route::put('/family-contacts/{contact}', [\App\Http\Controllers\Api\OrphanController::class, 'updateFamilyContact']);
    Route::delete('/family-contacts/{contact}', [\App\Http\Controllers\Api\OrphanController::class, 'destroyFamilyContact']);

    // Birthday Reminders
    Route::get('/orphans/upcoming-birthdays', [\App\Http\Controllers\Api\OrphanController::class, 'upcomingBirthdays']);

    // Donations
    Route::apiResource('donations', \App\Http\Controllers\Api\DonationController::class);

    // Dashboard Stats
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);
});

// Auth (no auth middleware for login/register)
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Protected logout
Route::middleware('auth:sanctum')->post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);

// Users list (protected)
Route::middleware('auth:sanctum')->get('/users', [\App\Http\Controllers\Api\AuthController::class, 'users']);
