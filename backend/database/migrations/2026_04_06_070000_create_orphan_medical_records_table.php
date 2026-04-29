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
        Schema::create('orphan_medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orphan_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('doctor_name')->nullable();
            $table->text('description');
            $table->string('diagnosis')->nullable();
            $table->text('treatment')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orphan_medical_records');
    }
};

