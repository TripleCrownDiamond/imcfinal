<?php

namespace App\Http\Controllers;

use App\Models\Config;
use App\Models\Currency;
use App\Models\DepositMethod;
use App\Models\GlobalConfig;
use App\Models\Transaction;
use App\Models\TransactionWallet;
use App\Models\User;
use App\Models\WithdrawalMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class TransactionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isAdmin = $user->role === 'admin';

        // Gestion des transactions pour les administrateurs
        if ($isAdmin) {
            $transactions = Transaction::with(['sender', 'receiver', 'withdrawalMethod', 'transactionWallet', 'depositMethod'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        } else {
            // Transactions envoyées par l'utilisateur
            $sentTransactions = Transaction::with(['receiver', 'withdrawalMethod', 'transactionWallet', 'depositMethod'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc');

            // Transactions reçues par l'utilisateur
            $receivedTransactions = Transaction::with(['sender', 'withdrawalMethod', 'transactionWallet', 'depositMethod'])
                ->where('receiver_username', $user->username)
                ->orderBy('created_at', 'desc');

            // Union des deux ensembles de transactions
            $transactions = $sentTransactions->union($receivedTransactions)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        }

        // Transformer les données pour inclure le username de l'expéditeur
        $transactions->getCollection()->transform(function ($transaction) {
            if (isset($transaction['user_id'])) {
                $sender = User::find($transaction['user_id']);
                $transaction['sender_username'] = $sender ? $sender->username : 'Inconnu';
            }
            return $transaction;
        });

        //dd($transactions);

        // Renvoyer les transactions et les informations utilisateur
        return inertia('Transaction/TransactionList', [
            'transactions' => $transactions,
            'isAdmin' => $isAdmin,
            'user' => $user,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {

        // Récupérer les méthodes de dépôt avec leurs champs associés
        $depositMethods = DepositMethod::with('fields')->get();

        $withdrawalMethods = WithdrawalMethod::all();
        return inertia('Transaction/Create', [
            'depositMethods' => $depositMethods,
            'withdrawalMethods' => $withdrawalMethods,
        ]);
    }

    public function transfer(Request $request)
    {
        // Validation avec messages d'erreur personnalisés
        $request->validate([
            'transactionType' => 'required|in:transfer,deposit,withdraw',
            'amount' => 'required|numeric|min:1',
            'recipientUsername' => 'required_if:transactionType,transfer|exists:users,username',
        ], [
            'transactionType.required' => 'Veuillez choisir un type de transaction.',
            'transactionType.in' => 'Le type de transaction sélectionné est invalide.',
            'amount.required' => 'Veuillez entrer un montant.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant doit être supérieur à zéro.',
            'recipientUsername.required_if' => 'Le nom d\'utilisateur du destinataire est requis pour un transfert.',
            'recipientUsername.exists' => 'Le destinataire spécifié n\'existe pas.',
        ]);

        // Récupération de l'utilisateur authentifié
        $user = auth()->user();

        // Vérification du solde de l'utilisateur
        if (!$user->hasSufficientBalance($request->amount)) {
            return back()->withErrors(['amount' => 'Solde insuffisant pour effectuer cette transaction.']);
        }

        // Récupération du destinataire
        $recipient = User::where('username', $request->recipientUsername)->first();

        // Initialisation des champs `amount_deducted` et `amount_credited` à `false`
        $amountDeducted = false;
        $amountCredited = false;
        /* 
        // Débiter le solde de l'utilisateur et vérifier si l'opération réussit
        if ($user->deductBalance($request->amount)) {
            $amountDeducted = true;
        }

        // Crédite le solde du destinataire et vérifier si l'opération réussit
        if ($recipient->addBalance($request->amount)) {
            $amountCredited = true;
        } */

        // Création de la transaction avec les statuts `amount_deducted` et `amount_credited`
        $transaction = new Transaction([
            'user_id' => $user->id,
            'type' => $request->transactionType,
            'amount' => $request->amount,
            'receiver_username' => $recipient->username,
            'status' => 'pending',  // Transaction immédiatement confirmée
            'amount_deducted' => $amountDeducted,
            'amount_credited' => $amountCredited,
        ]);

        // Sauvegarder la transaction
        $transaction->save();

        // Flash message de succès pour la transaction
        return back()->with('flash', ['success' => 'Votre transaction est enregistrée avec succès et est en attente de traitement.']);
    }

    public function deposit(Request $request)
    {
        // Validation des données de la requête avec messages personnalisés
        $request->validate([
            'transactionType' => 'required|in:deposit',
            'amount' => 'required|numeric|min:1',
            'depositMethod' => 'required|exists:deposit_methods,id',
        ], [
            'transactionType.required' => 'Le type de transaction est requis.',
            'transactionType.in' => 'Le type de transaction doit être un dépôt.',
            'amount.required' => 'Le montant est requis.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant minimum est de 1.',
            'depositMethod.required' => 'La méthode de dépôt est requise.',
            'depositMethod.exists' => 'La méthode de dépôt choisie n\'existe pas.',
        ]);

        $currencies = Currency::all();  // Récupère toutes les devises

        // Récupérer la devise avec l'ID 1
        $currency = $currencies->firstWhere('id', 1);

        if ($request->currency === 0) {
            $amount = $request->amount;
        } else {
            // Si une devise avec ID 1 est trouvée, on l'utilise pour calculer le montant
            if ($currency) {
                $amount = $request->amount * $currency->value_in_i_coin;
            } else {
                // Gestion du cas où la devise avec ID 1 n'est pas trouvée
                // Vous pouvez ajouter un message d'erreur ou une autre gestion ici
                $amount = $request->amount; // Par défaut, sans conversion
            }
        }

        //dd($amount);

        // Récupérer l'utilisateur authentifié
        $user = auth()->user();

        // Création de la transaction
        $transaction = new Transaction([
            'user_id' => $user->id,
            'type' => 'deposit',
            'amount' => $amount,
            'deposit_method_id' => $request->depositMethod, // ID de la méthode de dépôt
            'status' => 'pending', // Le statut est "en attente"
        ]);

        // Sauvegarde de la transaction dans la base de données
        $transaction->save();

        // Retourner avec un message de succès
        return back()->with('flash', ['success' => 'Votre dépôt de ' . $request->amount . ' est en attente de validation par l\'administrateur.']);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'transactionType' => 'required|in:withdraw',
            'amount' => 'required|numeric|min:1',
            'withdrawalMethod' => 'required|exists:withdrawal_methods,id',
            'currency' => 'nullable|integer',  // Le champ de devise est maintenant facultatif
            'walletAddress' => 'required|string',  // Ajout de la validation pour le wallet ou compte
        ], [
            'transactionType.required' => 'Le type de transaction est requis.',
            'transactionType.in' => 'Le type de transaction doit être un retrait.',
            'amount.required' => 'Veuillez indiquer le montant à retirer.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant doit être d\'au moins 1.',
            'withdrawalMethod.required' => 'La méthode de retrait est requise.',
            'withdrawalMethod.exists' => 'La méthode de retrait sélectionnée est invalide.',
            'currency.integer' => 'La devise doit être un entier valide.',
            'walletAddress.required' => 'Le champ numéro du compte ou addresse de portefeuille est requis.',
            'walletAddress.string' => 'Le champ du compte ou portefeuille doit être une chaîne de caractères.',
        ]);


        if ($request->walletAdress !== "") {
            $wallet = $request->walletAddress;
        } else {
            $wallet = "N/A";
        }

        // Logique de conversion si la devise est USD (avant toute autre opération)
        $currencies = Currency::all();
        $currency = $currencies->firstWhere('id', 1); // La devise avec ID 1 (USD)

        if ($request->currency === 0) {
            $amount = $request->amount;  // Pas de conversion si la devise est 0 (pas de conversion nécessaire)
        } else {
            if ($currency) {
                // Conversion de l'argent en utilisant la valeur de la devise (USD)
                $amount = $request->amount * $currency->value_in_i_coin;
            } else {
                // En cas de devise introuvable, on prend la valeur originale
                $amount = $request->amount;
            }
        }

        //dd($amount);

        $user = auth()->user();

        // Vérification du solde de l'utilisateur après la conversion du montant
        if (!$user->hasSufficientBalance($amount)) {
            return back()->withErrors(['amount' => 'Solde insuffisant pour ce retrait.']);
        }

        // Déduction du solde de l'utilisateur après la conversion
        //$user->deductBalance($amount);

        // Création de la transaction
        $transaction = new Transaction([
            'user_id' => $user->id,
            'type' => $request->transactionType,
            'amount' => $amount,  // Montant converti
            'withdrawal_method_id' => $request->withdrawalMethod,
            'status' => 'pending',
        ]);

        $transaction->save();

        // Enregistrement dans la table transaction_wallets
        $wallet = new TransactionWallet([
            'transaction_id' => $transaction->id,
            'withdrawal_method' => $request->withdrawalMethod,  // La méthode de retrait
            'account_or_wallet' => $wallet,  // Le compte ou wallet de retrait
        ]);

        $wallet->save();

        return back()->with('flash', ['success' => 'Retrait enregistré et en attente de validation.']);
    }

    public function confirm($transactionId)
    {
        // Démarrer la transaction
        DB::beginTransaction();

        try {
            // Récupérer la transaction
            $transaction = Transaction::find($transactionId);

            // Vérifier si la transaction existe
            if (!$transaction) {
                return back()->with('flash', ['error', 'Transaction non trouvée.']);
            }

            // Vérifier si la transaction est en statut 'pending'
            if ($transaction->status !== 'pending') {
                return back()->with('flash', ['error', 'La transaction n\'est pas en attente.']);
            }

            // Si la transaction est un retrait ou un transfert, mettre à jour le solde de l'utilisateur
            $user = User::find($transaction->user_id);

            if (!$user) {
                return back()->with('flash', ['error', 'Utilisateur non trouvé.']);
            }

            // Si c'est un dépôt, on met à jour `amount_credited` à true
            if ($transaction->type === 'deposit') {
                $user->addBalance($transaction->amount); // Ajouter le montant au solde de l'utilisateur
                $transaction->amount_credited = true; // Marquer le montant comme crédité
                $transaction->status = 'confirmed';
                $transaction->save();
            }
            // Si c'est un retrait, on met à jour `amount_deducted` à true si le solde est suffisant
            elseif ($transaction->type === 'withdraw') {
                if ($user->hasSufficientBalance($transaction->amount)) {
                    $user->deductBalance($transaction->amount); // Déduire le montant du solde de l'utilisateur
                    $transaction->amount_deducted = true; // Marquer le montant comme débité
                    $transaction->status = 'confirmed';
                    $transaction->save();
                } else {
                    return back()->with('flash', ['error', 'Solde insuffisant pour effectuer le retrait.']);
                }
            }
            // Si c'est un transfert, on met à jour les deux champs `amount_credited` et `amount_deducted` après le transfert
            elseif ($transaction->type === 'transfer') {
                // Récupérer le destinataire du transfert
                $receiver = User::where('username', $transaction->receiver_username)->first();

                if (!$receiver) {
                    return back()->with('flash', ['error', 'Destinataire non trouvé.']);
                }

                if ($user->hasSufficientBalance($transaction->amount)) {
                    // Déduire le montant du solde de l'utilisateur
                    $user->deductBalance($transaction->amount);
                    // Ajouter le montant au solde du destinataire
                    $receiver->addBalance($transaction->amount);
                    // Mettre à jour les champs appropriés
                    $transaction->amount_deducted = true; // Marquer le montant comme débité
                    $transaction->amount_credited = true; // Marquer le montant comme crédité
                    $transaction->status = 'confirmed';
                    $transaction->save();
                } else {
                    return back()->with('flash', ['error', 'Solde insuffisant pour effectuer le transfert.']);
                }
            }

            // Si tout est ok, on confirme la transaction
            DB::commit();

            return back()->with('flash', ['success', 'Transaction confirmée avec succès.']);
        } catch (\Exception $e) {
            // Si une erreur survient, on annule la transaction
            DB::rollBack();

            // Afficher l'erreur
            return back()->with('flash', ['error', 'Erreur lors de la confirmation de la transaction.']);
        }
    }

    // Annuler une transaction
    public function cancel($transactionId)
    {
        DB::beginTransaction();

        try {
            $transaction = Transaction::findOrFail($transactionId);

            // Vérifier si la transaction est en statut 'pending'
            if ($transaction->status !== 'pending') {
                return back()->with('error', 'La transaction n\'est pas en attente.');
            }

            // Mise à jour du statut de la transaction
            $transaction->status = 'canceled';
            $transaction->save();

            DB::commit();
            return back()->with('success', 'Transaction annulée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Une erreur est survenue lors de l\'annulation de la transaction.');
        }
    }
}
