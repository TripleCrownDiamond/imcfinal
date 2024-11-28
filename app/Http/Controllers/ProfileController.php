<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\KYC;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Récupérer les données KYC de l'utilisateur
        $kyc = $user->kyc()
            ->whereIn('document_type', ['identity_verification', 'address_verification'])
            ->get();

        return Inertia::render('Profile/Edit', [
            'status' => session('status'),
            'user' => $user,
            'kyc' => $kyc, // Ajout de KYC à la vue
        ]);
    }

    public function deleteKycDocument($user_id)
{
    // Recherche du document KYC par l'ID utilisateur
    $document = KYC::where('user_id', $user_id)->first();

    // Vérifier si le document existe
    if (!$document) {
        return back()->with('error', 'Document introuvable.');
    }

    // Supprimer le fichier du stockage
    if (Storage::exists('public/' . $document->document_path)) {
        Storage::delete('public/' . $document->document_path);
    }

    // Supprimer l'entrée de la base de données
    $document->delete();

    return back()->with('success', 'Document supprimé avec succès.');
}


    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        // Validation des champs
        $validated = $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:users,username,' . Auth::id(),
            'email'         => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'phone_number'  => 'nullable|string|max:15',
            'address'       => 'nullable|string|max:255',
            'birth_date'    => 'nullable|date',
        ]);

        // Mettre à jour l'utilisateur avec les nouvelles données
        $user = $request->user();
        $user->fill($validated);

        // Si l'email est changé, il faut réinitialiser la vérification de l'email
        if ($request->user()->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Sauvegarder les changements
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
    }

    // Soumettre les documents KYC
    public function submitKYC(Request $request)
    {
        $request->validate([
            'identity_verification' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240',
            'address_verification' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240',
        ]);

        // Vérifier si l'utilisateur est authentifié
        $user = Auth::user();

        // Télécharger les fichiers et enregistrer dans la base de données
        if ($request->hasFile('identity_verification')) {
            $identity_verificationPath = $request->file('identity_verification')->store('kyc_documents', 'public');
            KYC::create([
                'user_id' => $user->id,
                'document_type' => 'identity_verification',
                'document_path' => $identity_verificationPath,
                'status' => 'pending',
            ]);
        }

        if ($request->hasFile('address_verification')) {
            $identityCardPath = $request->file('address_verification')->store('kyc_documents', 'public');
            KYC::create([
                'user_id' => $user->id,
                'document_type' => 'address_verification',
                'document_path' => $identityCardPath,
                'status' => 'pending',
            ]);
        }

        // Rediriger avec un message de succès
        return redirect()->route('profile.edit')->with('status', 'Documents soumis pour vérification.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
