<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Simulate authentication
$user = User::find(3);
Auth::login($user);

echo "User: " . $user->name . "\n";
echo "User ID: " . $user->id . "\n";
echo "Has staff relationship: " . (method_exists($user, 'staff') ? 'YES' : 'NO') . "\n";

if ($user->staff) {
    echo "Staff ID: " . $user->staff->id . "\n";
} else {
    echo "Staff: NULL\n";
}

// Now test via the actual controller
use App\Http\Controllers\Api\DonationController;
use App\Domain\Donation\Services\DonationService;

echo "\n--- Testing DonationController ---\n";

$service = app(DonationService::class);
$controller = new DonationController($service);

// Create a mock request
$request = Request::create('/api/donations', 'POST', [
    'donor_name' => 'Test Donor',
    'amount' => 5000,
    'type' => 'cash',
    'date_received' => '2026-04-28',
]);
$request->headers->set('Authorization', 'Bearer ' . $user->createToken('test')->plainTextToken);
$request->setUserResolver(function() use ($user) { return $user; });

try {
    $response = $controller->store($request);
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo "Response data: " . json_encode($response->getData(true)) . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
