<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientFormRequest;
use App\Http\Requests\PatientFormStoreRequest;
use App\Models\Identity;
use App\Models\Location;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PatientController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    // dd($request->all());
    // $orderBy = [
    //   'campo' => 'updated_at',
    //   'direccion' => 'asc',
    // ];
    // $orderBy = null;

    $identities = Identity::select('code', 'name', 'long')->get();
    $patients = Patient::query()->with('locationAddress');
    if ($request->filled('s_last_name')) {
      $s_last_name = $request->s_last_name;
      $patients->where('last_name', 'like', "{$s_last_name}%");
      // $patients->where(fn($query)=>
      //     $query->where('nhc', 'like', "{$search}%")
      //         ->orWhere('last_name', 'like', "{$search}%")
      //         ->orWhere('first_name', 'like', "{$search}%")
      //         ->orWhere('identity_number', 'like', "{$search}%")
      // );
    }

    if ($request->filled('s_first_name')) {
      $s_first_name = $request->s_first_name;
      $patients->where('first_name', 'like', "{$s_first_name}%");
    }

    if ($request->filled('s_nhc')) {
      $s_nhc = $request->s_nhc;
      $patients->where('nhc', 'like', "{$s_nhc}%");
    }
    if ($request->filled('s_identity_number')) {
      $s_identity_number = $request->s_identity_number;
      $patients->where('identity_number', 'like', "{$s_identity_number}%");
    }
    if ($request->filled('s_birth_date')) {
      $s_birth_date = $request->s_birth_date;
      $patients->where('birth_date', 'like', "{$s_birth_date}%");
    }

    // Ordenamiento
    if($request->filled('o_field')){
      $direction = $request->o_direction ?? 'asc';
      $patients->orderBy($request->o_field, $direction);
    }else{
      if ($request->filled('s_last_name') || $request->filled('s_first_name')) {
        $patients->orderBy('last_name', 'asc')
          ->orderBy('first_name', 'asc')
          ->orderBy('nhc', 'desc');
      } else {
        $patients->orderBy('id', 'desc');
      }
    }

    $patients = $patients->paginate(100)->onEachSide(1)->withQueryString(); //Mantiene los parametros query string 
    $patients->getCollection()->transform(fn($patient) => [
      'id' => $patient->id,
      'nhc' => $patient->nhc,
      'last_name' => $patient->last_name,
      'first_name' => $patient->first_name,
      'identity_name' => $patient->identity?->name,
      'identity_number' => $patient->identity_number,
      'birth_date' => $patient->birth_date,
      'address' => $patient->address,
      'location_address_name' => $patient->locationAddress?->location_name,
      'entry_at' => $patient->entry_at?->format('Y-m-d H:i'),
      'debugged' => $patient->debugged,
      'created_at' => $patient->created_at?->format('Y-m-d H:i'),
      'updated_at' => $patient->updated_at?->format('Y-m-d H:i'),
    ]);

    return Inertia::render('patients/index', [
      'patients' => $patients,
      'identities' => $identities,
      // 'filters' => $request->only(['search']),
      'request_all' => $request->all(),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    // Gate::authorize('create-patientsss');
    // return Inertia::render('patients/patient-form');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(PatientFormRequest $request)
  {
    try {
      // $patient = null;
      DB::transaction(function () use ($request, &$patient) {
        // Obtiene el contador siguiente y bloquea la fila correspondiente a "next_nhc"
        $counter = DB::table('correlatives')
          ->where('name', 'next_nhc')
          ->lockForUpdate()
          ->first();
        // verifica si el valor de $counter exista en el campo nhc de la tabla patient
        $existeNHC = Patient::where('nhc', $counter->value)->first();
        if ($existeNHC) {
          // lanza una excepcion
          throw new \Exception("Error en la autonumaración de NHC");
        }
        // inserta el paciente
        $patient = Patient::create([
          'nhc' => $counter->value,
          'entry_at' => now(),
          'identity_code' => $request->identity_code,
          'identity_number' => $request->identity_number,
          'last_name' => $request->last_name,
          'first_name' => $request->first_name,
          'gender' => $request->gender,
          'birth_date' => $request->birth_date,
          'location_birth_id' => $request->location_birth_id,
          'address' => $request->address,
          'location_address_id' => $request->location_address_id,
          'phone' => $request->phone,
        ]);
        // Incrementar el contador
        DB::table('correlatives')
          ->where('name', 'next_nhc')
          ->update(['value' => $counter->value + 1]);
      });
      session()->flash('resp', [
        "msg" => "Paciente creado con éxito",
        "type" => "success",
        "action" => "storePatient",
        "data" => $patient
      ]);
      return redirect()->route('patients.index');
    } catch (\Exception $e) {
      // Log::error('Falló creación del paciente: ' . $e->getMessage());
      session()->flash('resp', [
        "msg" => $e->getMessage(),
        "type" => "error",
        "action" => "storePatient",
        "data" => null
      ]);
      return redirect()->route('patients.index');
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Patient $patient)
  {
    // dd($patient->toArray());
    // $identities = Identity::all();
    // return Inertia::render('patients/patient-form', compact('patient', 'identities'));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(PatientFormRequest $request, Patient $patient)
  {
    $patient->update($request->validated());
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Patient $patient)
  {
    $patient->delete();
    session()->flash('resp', [
      "msg" => "Paciente eliminado con éxito",
      "type" => "success",
      "action" => "destroyPatient",
      "data" => $patient
    ]);
    return redirect()->route('patients.index');
  }

  // Metodos adicionales

  public function data(string $id)
  {
    // $patient = Patient::where('id', $id)->with(['locationAddress', 'locationBirth'])->get();
    // Gate::authorize('create_patients');
    $patient = Patient::with(['locationAddress', 'locationBirth'])->find($id);
    // $patient->created_at = $patient->created_at->format('d/m/Y H:i');
    // $patient->updated_at = $patient->updated_at->format('d/m/Y H:i');
    // dd($patient->toArray());
    return [
      'patient' => $patient,
    ];
  }

  public function updateDebugHc(Request $request, Patient $patient)
  {
    $patient->update(['debugged' => $request->value]);
    // return redirect()->route('patients.index');
  }

  public function hcClasica(string $id)
  {
    $HC_bulky = [0, 0, 609.5, 935]; // 21.5 x 33cm
    $patient = Patient::with(['locationAddress', 'locationBirth', 'identity'])->find($id);
    $arreglo = $patient->toArray();
    // Retorna un PDF que el navegador mostrará o descargará
    $pdf = Pdf::loadView('pdf.hc-clasica', ['patient' => $arreglo])
      ->setPaper($HC_bulky, 'portrait');
    return $pdf->stream('hc_clasica_' . $patient->nhc . '.pdf');
  }

  public function hojaIdentificacion(string $id)
  {
    $patient = Patient::with(['locationAddress', 'locationBirth', 'identity'])->find($id);
    $arreglo = $patient->toArray();
    // Retorna un PDF que el navegador mostrará o descargará
    $pdf = Pdf::loadView('pdf.hoja-identificacion', ['patient' => $arreglo]);
    return $pdf->stream('hoja_identificacion_' . $patient->nhc . '.pdf');
  }
}
