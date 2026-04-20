<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PatientFormRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    $rules = [
      'identity_code' => 'required',
      'identity_number' => 'required',
      'last_name' => 'required',
      'first_name' => 'required',
      'birth_date' => 'required',
      'gender' => ['required', 'in:F,M,f,m'],
      'birth_date' => 'nullable',
      'location_birth_id' => 'nullable',
      'address' => 'nullable',
      'location_address_id' => 'nullable',
      'phone' => 'nullable',
    ];

    if ($this->isMethod('post')) {
      // Reglas específicas para store
      $rules['identity_number'] = ['unique:patients,identity_number'];
    }

    if ($this->isMethod('put') || $this->isMethod('patch')) {
      // Reglas específicas para update
      $rules['identity_number'] = ['unique:patients,identity_number,' . $this->route('patient')->id];
    }

    return $rules;
  }

  public function messages()
  {
    // return parent::messages();
    $messages = [
      'identity_code.required' => 'El tipo de documento es requerido',
      'identity_number.required' => 'El número de documento es requerido',
      'last_name.required' => 'Los apellidos son requeridos',
      'first_name.required' => 'Los nombres son requeridos',
      'gender.required' => 'EL sexo es requerido',
      'gender.in' => 'El género debe ser F (femenino) o M (masculino).',
      'birth_date.required' => 'La fecha de nacimiento es requerida',
    ];

    if ($this->isMethod('post')) {
      // Mensajes específicos para creación
      $messages['identity_number.unique'] = 'El número de documento ya existe en otro paciente.';
    }

    if ($this->isMethod('put') || $this->isMethod('patch')) {
      // Mensajes específicos para actualización
      $messages['identity_number.unique'] = 'Este número de documento ya está asignado a otro paciente.';
    }

    return $messages;
  }
}
