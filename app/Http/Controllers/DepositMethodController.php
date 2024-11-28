<?php

namespace App\Http\Controllers;

use App\Models\DepositMethod;
use Illuminate\Http\Request;


class DepositMethodController extends Controller
{
    public function index()
    {
        $depositMethods = DepositMethod::with('fields')->get();
        return inertia('Admin/DepositMethods', [
            'depositMethods' => $depositMethods,
            'isAdmin' => auth()->user()->role === "admin", // Supposant que l'utilisateur a une propriété isAdmin
        ]);
    }

    public function edit(DepositMethod $depositMethod)
    {
        $depositMethod->load('fields'); // Charger les champs associés
    
        return inertia('Admin/EditDepositMethod', [
            'depositMethod' => $depositMethod->toArray(), // Convertir en tableau
        ]);
    }

    public function update(Request $request, $id)
    {
        $depositMethod = DepositMethod::findOrFail($id);
        
        // Validation des données
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'array',
            'fields.*.id' => 'exists:deposit_method_fields,id', // Correction du nom de la table
            'fields.*.field_name' => 'required|string|max:255',
            'fields.*.field_type' => 'required|string|max:255',
            'fields.*.field_value' => 'nullable|string',
        ], [
            'name.required' => 'Le nom de la méthode de dépôt est requis.',
            'name.string' => 'Le nom de la méthode de dépôt doit être une chaîne de caractères valide.',
            'name.max' => 'Le nom de la méthode de dépôt ne peut pas dépasser 255 caractères.',
            'description.string' => 'La description doit être une chaîne de caractères valide.',
            'fields.array' => 'Les champs doivent être un tableau.',
            'fields.*.id.exists' => 'Le champ sélectionné n\'existe pas.',
            'fields.*.field_name.required' => 'Le nom du champ est requis.',
            'fields.*.field_name.string' => 'Le nom du champ doit être une chaîne de caractères valide.',
            'fields.*.field_name.max' => 'Le nom du champ ne peut pas dépasser 255 caractères.',
            'fields.*.field_type.required' => 'Le type de champ est requis.',
            'fields.*.field_type.string' => 'Le type de champ doit être une chaîne de caractères valide.',
            'fields.*.field_type.max' => 'Le type de champ ne peut pas dépasser 255 caractères.',
            'fields.*.field_value.string' => 'La valeur du champ doit être une chaîne de caractères valide.',
        ]);
        
        // Mise à jour de la méthode de dépôt
        $depositMethod->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);
        
        // Mise à jour des champs associés
        foreach ($validated['fields'] as $fieldData) {
            $field = $depositMethod->fields()->find($fieldData['id']);
            if ($field) {
                $field->update([
                    'field_name' => $fieldData['field_name'],
                    'field_type' => $fieldData['field_type'],
                    'field_value' => $fieldData['field_value'],
                ]);
            }
        }
        
        // Redirection vers la page précédente avec un message flash
        return redirect()->back()->with('flash', ['success', 'Méthode mise à jour avec succès.']);
    }
    
    
    
}
