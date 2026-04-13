<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function all()
    {
        $locations = Location::select(['id', 'location_name'])
            ->orderBy('location_name')->get();

        return $locations;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $results = Location::where('location_name', 'like', "{$query}%")
            ->where('status', 1)
            ->orWhere('ubigeo_inei', "{$query}")
            ->orWhere('ubigeo_reniec', "{$query}")
            ->limit(20)
            ->get(['id', 'location_name']);

        return response()->json($results);
    }

    
}
