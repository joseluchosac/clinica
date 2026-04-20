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
    Schema::create('patients_updated', function (Blueprint $table) {
      $table->id(); // BIGINT UNSIGNED AUTO_INCREMENT
      $table->unsignedBigInteger('nhc')->nullable(); // BIGINT UNSIGNED AUTO_INCREMENT
      $table->timestamp('entry_at')->nullable();
      // Datos de Identidad
      $table->string('identity_code', 2)->nullable(); // Relación a la tabla identities
      $table->string('identity_number', 20)->nullable();

      // Datos Personales
      $table->string('last_name', 100); // apellidos
      $table->string('first_name', 100); // nombres
      $table->enum('gender', ['M', 'F'])->nullable();
      $table->date('birth_date')->nullable();
      $table->integer('location_birth_id')->nullable(); // Relación a la tabla locations

      // Contacto
      $table->string('address', 150)->nullable();
      $table->integer('location_address_id')->nullable(); // Relación a la tabla locations
      $table->string('phone', 50)->nullable();

      // Degub
      $table->tinyInteger('debugged')->default(0)->nullable();

      // Estado y Tiempos
      $table->tinyInteger('state')->default(1)->comment('1:Active, 0:Inactive');
      $table->timestamps();
      $table->string('action')->nullable();
      $table->string('finished')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('patients_updated');
  }
};
