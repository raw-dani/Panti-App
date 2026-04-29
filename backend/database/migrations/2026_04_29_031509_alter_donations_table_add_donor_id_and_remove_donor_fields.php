<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            // Add donor_id foreign key
            $table->foreignId('donor_id')->nullable()->constrained()->nullOnDelete();
            
            // Make the old donor fields nullable first (for data migration)
            $table->string('donor_name')->nullable()->change();
            $table->string('donor_email')->nullable()->change();
            $table->string('donor_phone')->nullable()->change();
        });
        
        // Migrate existing data: create donors from donation records
        // This is a simplified approach - in production you might want to handle duplicates better
        \DB::statement("
            INSERT INTO donors (name, email, phone, created_at, updated_at)
            SELECT DISTINCT donor_name, donor_email, donor_phone, NOW(), NOW()
            FROM donations 
            WHERE donor_name IS NOT NULL
        ");
        
        // Link donations to donors
        \DB::statement("
            UPDATE donations d
            JOIN donors don ON d.donor_name = don.name 
                AND (d.donor_email = don.email OR (d.donor_email IS NULL AND don.email IS NULL))
                AND (d.donor_phone = don.phone OR (d.donor_phone IS NULL AND don.phone IS NULL))
            SET d.donor_id = don.id
        ");
        
        // Now make the old donor fields not nullable in a practical sense
        // But we'll keep them for backward compatibility during transition
        // In a real app, you might remove them completely after verifying data integrity
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropForeign(['donor_id']);
            $table->dropColumn('donor_id');
            
            // Restore the old donor fields (they were made nullable)
            $table->string('donor_name')->nullable(false)->change();
            $table->string('donor_email')->nullable()->change();
            $table->string('donor_phone')->nullable()->change();
        });
    }
};
