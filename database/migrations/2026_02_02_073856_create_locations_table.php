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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('country_code',4)->index();
            $table->string('country',100)->index();
            $table->string('ubigeo_inei',6)->unique();
            $table->string('ubigeo_reniec',6)->unique();
            $table->string('location_name');
            $table->string('departamento',100)->nullable()->index();
            $table->string('provincia',100)->nullable()->index();
            $table->string('distrito',100)->nullable()->index();
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('order')->nullable();
            $table->timestamps();
            // Índices Compuestos y Únicos
            $table->index(['location_name'], 'idx_location_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
