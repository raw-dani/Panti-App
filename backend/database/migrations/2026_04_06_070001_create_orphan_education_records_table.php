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
        Schema::create('orphan_education_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orphan_id')->constrained()->onDelete('cascade');
            $table->string('school_name');
            $table->string('grade_class');
            $table->string('academic_year');
            $table->enum('semester', ['1', '2'])->default('1');
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orphan_education_records');
    }
};

