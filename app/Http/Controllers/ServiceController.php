<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ServiceController extends Controller
{
    public function consultarDni(Request $request)
    {
        // Validar que se envíe el número de DNI
        $request->validate([
            'numero' => 'required|digits:8',
        ]);

        $numero = $request->input('numero');

        // Token de autenticación (puedes guardarlo en .env)
        // $token = config('services.decolecta.token');
        $token = "apis-token-14205.BsXqAhs4d2oJCiup9gofNeTfCzFMrYxP";

        // Hacer la petición al API
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->get("https://api.decolecta.com/v1/reniec/dni?numero=$numero");

        // Manejo de errores
        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar el DNI',
                'error' => $response->json(),
                'data' => null,
            ], $response->status());
        }

        // Retornar la respuesta al frontend (Inertia/React)
        return response()->json([
            'success' => true,
            'message' => 'DNI consultado correctamente',
            'data' => $response->json(),
        ]);
    }
}
