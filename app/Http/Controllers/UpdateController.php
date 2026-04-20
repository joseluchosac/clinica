<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientUpdated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function Pest\Laravel\json;

class UpdateController extends Controller
{
  public function index()
  {
    $this->updatePatients();
    return Inertia::render('archive/updates/index');
  }

  public function updatePatients()
  {
    $patients_updated = PatientUpdated::query()->orderBy('updated_at');
    $patients_updated = $patients_updated->get();

    foreach ($patients_updated as $key => $patient_updated) {
      $finished = 'ok';
      if ($patient_updated->finished == 'ok') {
        continue;
      }
      if ($patient_updated->action == 'updated') {
        $paciente = Patient::find($patient_updated->id);
        if ($paciente) {
          $this->update($patient_updated->toArray());
        } else {
          continue;
        }
      } elseif ($patient_updated->action == 'created') {
        $this->store($patient_updated->toArray());
      };

      // $patient_updated->update(['finished' => $finished]);
    }
    return "ok";
  }

  private function store(array $patient_updated)
  {
    unset($patient_updated['id']);
    unset($patient_updated['action']);
    unset($patient_updated['finished']);
    $patient = new Patient();
    $patient->timestamps = false; // evita que Eloquent los sobrescriba
    $patient->fill($patient_updated);
    $patient->created_at = Carbon::parse($patient_updated['created_at'])->format('Y-m-d H:i:s');
    $patient->updated_at = Carbon::parse($patient_updated['updated_at'])->format('Y-m-d H:i:s');
    $patient->save();
  }

  private function update(array $patient_updated)
  {
    $id = $patient_updated['id'];
    unset($patient_updated['id']);
    unset($patient_updated['action']);
    unset($patient_updated['finished']);
    $patient = Patient::find($id);
    $patient->timestamps = false; // evita que Eloquent los sobrescriba
    $patient->fill($patient_updated);
    $patient->created_at = $patient_updated['created_at'] ? Carbon::parse($patient_updated['created_at'])->format('Y-m-d H:i:s') : null;
    $patient->updated_at = Carbon::parse($patient_updated['updated_at'])->format('Y-m-d H:i:s');
    $patient->save();
  }
}
