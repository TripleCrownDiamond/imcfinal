<?php

// app/Http/Controllers/TranslationController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TranslationController extends Controller
{
    public function index($locale)
    {
        $translations = [];

        // Charger le fichier de traduction approprié
        if (in_array($locale, ['fr', 'en'])) {
            $translations = json_decode(file_get_contents(resource_path("lang/{$locale}.json")), true);
        }

        return response()->json($translations);
    }
}
