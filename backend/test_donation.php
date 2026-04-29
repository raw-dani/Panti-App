<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;

// Login as staff user
$user = User::find(3);
Auth::login($user);

echo "User: " . $user->name . "\n";
echo "User ID: " . $user->id . "\n";
echo "Role: " . $user->role . "\n";

if ($user->staff) {
    echo "Staff ID: " . $user->staff->id . "\n";
} else {
    echo "No staff record found!\n";
}

// Test donation creation
use App\Domain\Donation\Services\DonationService;
use App\Domain\Donation\Repositories\DonationRepositoryInterface;

$service = app(DonationService::class);

try {
    $donation = $service->createDonation([
        'donor_name' => 'Test Donor',
        'amount' => 5000,
        'type' => 'cash',
        'date_received' => '2026-04-28',
        'description' => 'Test donation'
    ]);
    
    echo "\nDonation created successfully!\n";
    echo "ID: " . $donation->id . "\n";
    echo "Receipt: " . $donation->receipt_no . "\n";
    echo "Staff ID: " . $donation->staff_id . "\n";
} catch (\Exception $e) {
    echo "\nError: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
