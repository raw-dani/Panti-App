<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Staff Panti',
            'email' => 'staff@panti.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'staff',
        ]);

        // Admin user
        \App\Models\User::create([
            'name' => 'Admin Panti',
            'email' => 'admin@panti.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        // Skip orphan factory for now - users created above
    }
}
