<?php

namespace App\Http\Controllers;

use App\Models\Correlative;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class AppSettingController extends Controller
{
    public function correlativeNhcEdit(): Response
    {
        Gate::authorize('update_app_settings');
        $maxNhc = Patient::max('nhc');
        $correlativeNhc = Correlative::where('name', 'next_nhc')->first();
        return inertia('settings/patients', [
            'correlativeNhc' => $correlativeNhc,
            'maxNhc' => $maxNhc,
        ]);

    }

    public function correlativeNhcUpdate(Request $request)
    {
        Gate::authorize('update_app_settings');
        $request->validate([
            'value' => 'required|integer|min:1',
        ]);
        $maxNhc = Patient::max('nhc');
        if($request->value <= $maxNhc){
            // dd('Valor incorrecto, se sugiere establecer ' . $maxNhc+1);
            session()->flash('resp', [
                "msg" => 'Valor incorrecto, se sugiere establecer ' . $maxNhc+1,
                "type" => "error",
                "action" => "correlativeNhcUpdate",
                "data" => null
            ]);
            return;
        }
        // dd($maxNhc, $request->value);
        $nextHC = Correlative::where('name', 'next_nhc')->first();
        $nextHC->update(['value' => $request->value]);
        session()->flash('resp', [
            "msg" => 'El correlativo se actualizó correctamente',
            "type" => "success",
            "action" => "correlativeNhcUpdate",
            "data" => null
        ]);
        // return redirect()->back()->with('message', 'Correlativo actualizado');
    }
}
