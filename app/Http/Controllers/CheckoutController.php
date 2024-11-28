<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Formation;
use App\Models\FormationSubscription;
use App\Models\Invoice;
use App\Models\TradingBot;
use App\Models\PaymentMethod; // Importer le modèle PaymentMethod
use App\Services\SponsorService; // Importer le service SponsorService
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    // Utilisation de la constante mainCurrencyName définie dans le .env
    const MAIN_CURRENCY_NAME = 'I-coin'; // Valeur par défaut
    protected $currencyName;
    protected $sponsorService; // Ajout de la propriété pour SponsorService

    public function __construct(SponsorService $sponsorService) // Injection de SponsorService
    {
        $this->currencyName = env('MAIN_CURRENCY_NAME', self::MAIN_CURRENCY_NAME);
        $this->sponsorService = $sponsorService; // Initialisation de la propriété
    }

    public function index($productType, $productId)
    {
        $user = Auth::user()->load('country');

        // Définir un tableau vide pour les informations produit
        $product = null;
        $isSubscribed = false;

        // Vérifier si le produit est un cours
        if ($productType === 'course') {
            $product = Formation::findOrFail($productId);

            // Vérifier si l'utilisateur est déjà abonné au cours
            $isSubscribed = FormationSubscription::where('user_id', $user->id)
                ->where('formation_id', $productId)
                ->exists();

            // Ajouter des informations communes et spécifiques au produit "course"
            $product = [
                'id' => $product->id,
                'type' => 'course',
                'name' => $product->name,
                'price_usd' => $product->price_usd,
                'price_i_coin' => $product->price_i_coin,
                'description' => $product->description,
                'advantages' => $product->advantages,
                'videos' => $product->videos, // Liste des vidéos
            ];
        } elseif ($productType === 'bot') {
            $product = TradingBot::findOrFail($productId);

            // Vérifier si l'utilisateur est déjà abonné au bot
            $isSubscribed = Subscription::where('user_id', $user->id)
                ->where('bot_id', $productId)
                ->exists();

            // Ajouter des informations communes et spécifiques au produit "bot"
            $product = [
                'id' => $product->id,
                'type' => 'bot',
                'name' => $product->name,
                'price_usd' => $product->cost_usd,
                'price_i_coin' => $product->cost_icoin,
                'description' => '', // Vous pouvez ajouter des détails spécifiques au bot ici
                'daily_profit_percentage' => $product->daily_profit_percentage,
                'profit_duration_days' => $product->profit_duration_days,
                'minimum_deposit_usd' => $product->minimum_deposit_usd,
                'minimum_deposit_icoin' => $product->minimum_deposit_icoin,
            ];
        } else {
            abort(404, "Type de produit inconnu");
        }

        // Charger les méthodes de paiement actives
        $paymentMethods = PaymentMethod::all();

        // Passer les informations à la vue avec Inertia
        return inertia('Checkout/Checkout', [
            'productType' => $productType,
            'product' => $product, // Tableau contenant les informations produit
            'paymentMethods' => $paymentMethods,
            'user' => $user,
            'flash' => session('flash'),
            'isSubscribed' => $isSubscribed, // Indicateur de souscription
        ]);
    }


    public function processCheckout(Request $request): RedirectResponse
    {
    
        $request->validate([
            'productId' => 'required|integer',
            'productType' => 'required|string|max:255',
            'paymentMethod' => 'required|string',
            'billingDetails' => 'required|array',
            'billingDetails.first_name' => 'required|string|max:255',
            'billingDetails.last_name' => 'required|string|max:255',
            'billingDetails.username' => 'required|string|max:255',
            'billingDetails.email' => 'required|email|max:255',
            'billingDetails.country' => 'required|string|max:255',
            'billingDetails.city' => 'required|string|max:255',
            'billingDetails.address' => 'required|string|max:255',
        ], [
            'productId.required' => 'L\'identifiant du produit est requis.',
            'productId.integer' => 'L\'identifiant du produit doit être un nombre entier.',
            'productType.required' => 'Le type de produit est requis.',
            'paymentMethod.required' => 'Le mode de paiement est requis.',
            'billingDetails.required' => 'Les détails de facturation sont requis.',
            'billingDetails.*.required' => 'Ce champ est requis.',
        ]);

        $user = auth()->user();
        $productId = $request->input('productId');
        $productType = $request->input('productType');
        $paymentMethodId = $request->input('paymentMethod');
        $billingDetails = $request->input('billingDetails');

        $product = $this->getProduct($productType, $productId);
        if (!$product) {
            return redirect()->back()->with('flash', ['error' => 'Produit non trouvé ou type de produit invalide.']);
        }

        $paymentMethod = PaymentMethod::find($paymentMethodId);
        if (!$paymentMethod) {
            return redirect()->back()->with('flash', ['error' => 'Méthode de paiement invalide.']);
        }

        // Si le moyen de paiement est en i-coin
        if ($paymentMethod->uniq_id === strtolower(self::MAIN_CURRENCY_NAME)) {
            $productCost = $product->price_i_coin ?? $product->cost_icoin;

            // Vérifier le solde utilisateur
            if ($user->balance < $productCost) {
                return redirect()->back()->with('flash', ['error' => 'Fonds insuffisants.']);
            }

            // Déduction du solde
            $this->createInvoice($user->uniq_id, $productId, $productType, $paymentMethod->id, $billingDetails, 'paid');
            $user->balance -= $productCost;

            // Distribution des gains
            $totalSponsorGains = $this->sponsorService->calculateTotalSponsorGains($user, $productCost);
            $remainingAmount = $productCost - $totalSponsorGains;

            if ($admin = User::where('role', 'admin')->first()) {
                $admin->balance += $remainingAmount;
                $admin->save();
            }

            // Distribution des gains aux sponsors
            $this->sponsorService->distributeGainsToSponsors($user, $productCost);

            // Enregistrement de la souscription
            $this->registerSubscription($user, $productType, $productId, $product->profit_duration_days ?? null);

            $user->save();

            return redirect()->back()->with('flash', ['success' => 'Achat réussi, merci !']);
        }

        return redirect()->back()->with('flash', ['error' => 'Moyen de paiement non pris en charge.']);
    }

    private function getProduct(string $productType, int $productId)
    {
        return match ($productType) {
            'course' => Formation::find($productId),
            'bot' => TradingBot::find($productId),
            default => null,
        };
    }

    private function registerSubscription($user, string $productType, int $productId, ?int $durationDays)
    {
        if ($productType === 'course') {
            FormationSubscription::create(['user_id' => $user->id, 'formation_id' => $productId]);
        } elseif ($productType === 'bot' && $durationDays) {
            Subscription::create([
                'user_id' => $user->id,
                'bot_id' => $productId,
                'subscription_date' => now(),
                'expiration_date' => now()->addDays($durationDays),
            ]);
        }
    }


    protected function createInvoice($userUniqId, $productId, $productType, $paymentMethodId, $billingDetails, $status)
    {
        return Invoice::create([
            'invoice_number' => 'INV-' . strtoupper(uniqid()), // Exemple de génération de numéro de facture
            'user_uniq_id' => $userUniqId,
            'product_id' => $productId,
            'product_type' => $productType,
            'payment_method' => $paymentMethodId,
            'status' => $status,
            'billing_details' => json_encode($billingDetails),
            'invoice_date' => now(),
            'paid_at' => $status === 'paid' ? now() : null,
        ]);
    }
}
