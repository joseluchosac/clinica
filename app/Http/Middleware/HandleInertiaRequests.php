<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Obtener el idioma actual
        $locale = app()->currentLocale();
        
        // Cargar el archivo JSON de traducciones
        $langFile = base_path("lang/{$locale}.json");
        $translations = File::exists($langFile) 
            ? json_decode(File::get($langFile), true) 
            : [];
            
        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => $locale,
            'translations' => $translations,
            'locales' => [
                'es' => 'Español',
                'en' => 'English',
            ],
            // nuevo agredado del tutorial Laravel 12 + React Just Changed Everything! indi
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'datos' => $request->session()->get('datos'),
            ],
        ]);
    }
}
