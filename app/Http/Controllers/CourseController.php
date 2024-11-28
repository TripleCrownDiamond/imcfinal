<?php

namespace App\Http\Controllers;

use App\Models\CourseFile;
use App\Models\Formation;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        // Récupérer les cours par ordre décroissant
        $courses = Formation::orderBy('created_at', 'desc')->get();

        $user = Auth::user(); // Get the authenticated user

        // Retrieve the user's subscriptions
        $subscriptions = $user->formationSubscriptions()->pluck('formation_id')->toArray(); // Get an array of subscribed formation IDs

        // Send both courses and subscriptions to the view
        return inertia(
            'Course/CourseList ',
            [
                'courses' => $courses,
                'subscriptions' => $subscriptions,
                'userRole' => $user->role,
                'flash' => session('flash'),
            ]
        );
    }

    public function destroy($id)
    {
        $course = Formation::find($id);

        if ($course && $course->delete()) {
            // Redirection avec un message de succès si la suppression est réussie
            return redirect()->route('courses.index')->with('flash', [
                'success' => 'Cours supprimé avec succès!',
            ]);
        }

        // Redirection avec un message d'erreur si la suppression échoue
        return redirect()->route('courses.index')->with('flash', [
            'error' => 'Erreur lors de la suppression du cours!',
        ]);
    }

    public function create()
    {
        // Vérifiez si l'utilisateur authentifié a le rôle d'administrateur
        if (auth()->user()->role !== 'admin') {
            // Redirigez vers la liste des cours si l'utilisateur n'est pas admin
            return redirect()->route('courses.index')->with('flash', ['error', 'Vous n\'êtes pas autorisé à voir cette page!']);
        }

        // Affiche le formulaire d'ajout de cours si l'utilisateur est admin
        return inertia('Course/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_usd' => 'required|numeric',
            'price_i_coin' => 'required|numeric',
            'number_of_videos' => 'required|integer',
            'video_links' => 'array',
            'video_links.*' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,csv,xlsx,xls,ppt,pptx,zip,rar,mp3,wav|max:10240', // Validation pour les fichiers (ajout des audios)
        ], [
            'name.required' => 'Le nom du cours est requis.',
            'name.string' => 'Le nom du cours doit être une chaîne de caractères.',
            'name.max' => 'Le nom du cours ne doit pas dépasser 255 caractères.',

            'description.required' => 'La description est requise.',
            'description.string' => 'La description doit être une chaîne de caractères.',

            'price_usd.required' => 'Le prix en USD est requis.',
            'price_usd.numeric' => 'Le prix en USD doit être un nombre.',

            'price_i_coin.required' => 'Le prix en I-Coin est requis.',
            'price_i_coin.numeric' => 'Le prix en I-Coin doit être un nombre.',

            'number_of_videos.required' => 'Le nombre de vidéos est requis.',
            'number_of_videos.integer' => 'Le nombre de vidéos doit être un entier.',

            'video_links.array' => 'Les liens vidéo doivent être sous forme de liste.',
            'video_links.*.string' => 'Chaque lien vidéo doit être une chaîne de caractères.',

            'files.array' => 'Les fichiers doivent être sous forme de liste.',
            'files.*.file' => 'Chaque fichier doit être un fichier valide.',
            'files.*.mimes' => 'Les fichiers doivent être de type : PDF, Word, Image, CSV, Excel, PowerPoint, Zip, Rar, MP3 ou WAV.',
            'files.*.max' => 'La taille de chaque fichier ne doit pas dépasser 10 Mo.',
        ]);

        $formation = Formation::create($request->only(['name', 'description', 'price_usd', 'price_i_coin', 'number_of_videos']));

        // Stocker les liens des vidéos
        if ($request->video_links) {
            foreach ($request->video_links as $link) {
                if ($link) {
                    Video::create([
                        'formation_id' => $formation->id,
                        'link' => $link,
                    ]);
                }
            }
        }

        // Stocker les fichiers dans public/course_files
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('course_files', 'public'); // Stocke les fichiers dans public/course_files
                CourseFile::create([
                    'formation_id' => $formation->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return redirect()->route('courses.create')->with('flash', [
            'success' => 'Cours ajouté avec succès!',
        ]);
    }

    public function show($id)
    {
        $course = Formation::with(['videos', 'courseFiles'])->findOrFail($id);

        return inertia('Course/CourseDetails', [
            'course' => $course,
            'videos' => $course->videos,
            'files' => $course->courseFiles,
        ]);
    }

    public function edit($id)
    {
        // Récupérer le cours à éditer avec ses vidéos et fichiers
        $course = Formation::with(['videos', 'courseFiles'])->findOrFail($id);

        // Récupérer les attributs des courseFiles
        $existingFiles = $course->courseFiles->map(function ($file) {
            return [
                'id' => $file->id,
                'file_name' => $file->file_name,
                'file_path' => $file->file_path,
            ];
        });

        // Retourner le composant Inertia avec les données du cours
        return Inertia::render('Course/Edit', [
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'description' => $course->description,
                'price_usd' => $course->price_usd,
                'price_i_coin' => $course->price_i_coin,
                'number_of_videos' => $course->number_of_videos,
                'videos' => $course->videos,
                'existing_files' => $existingFiles, // Ajouter les fichiers existants
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_usd' => 'required|numeric',
            'price_i_coin' => 'required|numeric',
            'number_of_videos' => 'required|integer',
            'details' => 'nullable|string',
            'advantages' => 'nullable|string',
            'videos.*.link' => 'nullable|url', // Validation pour les liens vidéo
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,csv,xlsx,xls,ppt,pptx,zip,rar,mp3,wav|max:10240', // Validation pour les fichiers
        ], [
            'name.required' => 'Le nom du cours est requis.',
            'description.required' => 'La description est requise.',
            'price_usd.required' => 'Le prix en USD est requis.',
            'price_i_coin.required' => 'Le prix en I-Coin est requis.',
            'number_of_videos.required' => 'Le nombre de vidéos est requis.',
            'videos.*.link.url' => 'Le lien vidéo doit être une URL valide.',
            'files.*.file' => 'Le fichier doit être un fichier valide.',
            'files.*.mimes' => 'Les fichiers doivent être de type : PDF, Word, Image, CSV, Excel, PowerPoint, Zip, Rar, MP3 ou WAV.',
            'files.*.max' => 'La taille du fichier ne doit pas dépasser 10 Mo.',
        ]);


        // Mettre à jour le cours
        $course = Formation::findOrFail($id);
        $course->update($validatedData);

        // Mettre à jour le cours
        $course = Formation::findOrFail($id);
        $course->update($validatedData);

        // Traitement des vidéos
        if ($request->has('video_links')) {
            // Accéder aux liens des vidéos depuis `video_links`
            $videos = $request->input('video_links');

            // Créez un tableau de liens de vidéos
            $videoLinks = [];
            foreach ($videos as $link) {
                if (!empty($link)) {
                    $videoLinks[] = ['link' => $link];
                }
            }

            // Supprime les vidéos existantes et ajoute les nouvelles
            $course->videos()->delete();
            $course->videos()->createMany($videoLinks);
        }

        // Traitement des fichiers
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filePath = $file->store('course_files', 'public'); // Stocker le fichier et obtenir le chemin
                CourseFile::create([
                    'formation_id' => $course->id,
                    'file_path' => $filePath,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Rediriger vers la page précédente avec un message de succès
        return redirect()->back()->with('success', 'Le cours a été mis à jour avec succès.');
    }

    public function deleteFile($courseId, $fileId)
    {
        $course = Formation::find($courseId);

        if (!$course) {
            // Si le cours n'existe pas, rediriger avec un message d'erreur
            return redirect()->route('courses.edit', $courseId)
                ->with('flash', ['error' => 'Cours introuvable !']);
        }

        $file = $course->courseFiles()->find($fileId);

        if (!$file) {
            // Si le fichier n'existe pas, rediriger avec un message d'erreur
            return redirect()->route('courses.edit', $courseId)
                ->with('flash', ['error' => 'Fichier introuvable !']);
        }

        // Supprimer le fichier du stockage
        if (Storage::disk('public')->exists($file->file_path)) {
            Storage::disk('public')->delete($file->file_path);
        } else {
            // Si le fichier n'existe pas dans le stockage, rediriger avec un message d'erreur
            return redirect()->route('courses.edit', $courseId)
                ->with('flash', ['error' => 'Le fichier n\'existe pas dans le stockage !']);
        }

        // Supprimer l'enregistrement de la base de données
        if ($file->delete()) {
            // Rediriger avec un message de succès flash
            return redirect()->route('courses.edit', $courseId)
                ->with('flash', ['success' => 'Fichier supprimé avec succès !']);
        } else {
            // Si la suppression de la base de données échoue, rediriger avec un message d'erreur
            return redirect()->route('courses.edit', $courseId)
                ->with('flash', ['error' => 'Erreur lors de la suppression du fichier de la base de données !']);
        }
    }
}
