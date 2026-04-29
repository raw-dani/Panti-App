<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

// Login user
$user = User::find(3);
Auth::login($user);

echo "User ID: " . Auth::id() . "\n";
echo "User name: " . Auth::user()->name . "\n";

// Check if staff relationship exists and works
echo "\nChecking staff relationship:\n";
$staff = Auth::user()->staff;
if ($staff) {
    echo "Staff ID: " . $staff->id . "\n";
    echo "Staff position: " . $staff->position . "\n";
} else {
    echo "Staff is NULL\n";
}

// Check database directly
echo "\nChecking database directly:\n";
$staffFromDb = DB::table('staff')->where('user_id', Auth::id())->first();
if ($staffFromDb) {
    echo "Staff ID from DB: " . $staffFromDb->id . "\n";
} else {
    echo "No staff record in DB\n";
}
