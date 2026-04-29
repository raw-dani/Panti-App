<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Orphan\Models\Orphan;
use App\Domain\Staff\Models\Staff;
use App\Domain\Donation\Models\Donation;
use App\Domain\Event\Models\Event;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        // Total orphans
        $totalOrphans = Orphan::count();

        // Total active staff
        $totalActiveStaff = Staff::whereHas('user', function($query) {
            $query->where('role', 'staff');
        })->count();

        // Donations this month
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $donationsThisMonth = Donation::whereMonth('date_received', $currentMonth)
            ->whereYear('date_received', $currentYear)
            ->sum('amount');

        // Upcoming events (next 30 days)
        $upcomingEventsCount = Event::where('date', '>=', now())
            ->where('date', '<=', now()->addDays(30))
            ->count();

        return response()->json([
            'total_orphans' => $totalOrphans,
            'total_active_staff' => $totalActiveStaff,
            'donations_this_month' => $donationsThisMonth,
            'upcoming_events' => $upcomingEventsCount,
        ]);
    }
}