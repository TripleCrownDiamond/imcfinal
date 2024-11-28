<?php

use App\Http\Controllers\DepositMethodController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\BotController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CommandController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\NetworkController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TradingBotController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Models\Country;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil
Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard protégé par les middlewares auth et verified
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});


// Routes protégées par le middleware auth
Route::middleware('auth')->group(function () {
    // Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Soumettre les documents KYC
    Route::post('/profile/kyc', [ProfileController::class, 'submitKYC'])->name('profile.kyc.submit');

    Route::post('/calculate-daily-profits', [CommandController::class, 'executeProfitCalculation']);
  


     // Routes pour les formations
     Route::get('/courses', [CourseController::class, 'index'])->name('courses.index'); // Route pour la liste des cours
     Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create'); // Route pour afficher le formulaire de création de cours
     Route::post('/courses', [CourseController::class, 'store'])->name('courses.store'); // Route pour traiter l'ajout de cours
     Route::get('/course/{id}', [CourseController::class, 'show'])->name('course.show'); // Route pour afficher un cours
     // Ajoutez cette route dans le groupe de routes 'auth' pour les cours
     Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');
     Route::get('/courses/{id}/edit', [CourseController::class, 'edit'])->name('courses.edit');
     Route::delete('/courses/{courseId}/files/{fileId}/delete', [CourseController::class, 'deleteFile']);
 
     Route::post('/courses/{id}', [CourseController::class, 'update'])->name('courses.update'); // Route pour mettre à jour le cours
 

    // Checkout
    Route::get('/checkout/{productType}/{productId}', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/process', [CheckoutController::class, 'processCheckout'])->name('checkout.process');

    // Bots de trading
    Route::resource('bots', TradingBotController::class);
    Route::get('/bot/{id}/trading', [TradingBotController::class, 'trading'])->name('bot.trading');
    Route::post('/bots/{id}/deposit', [TradingBotController::class, 'deposit'])->name('trading.deposit');
    // Route pour traiter l'ajout du bot
    Route::post('/new-bot', [TradingBotController::class, 'store']);
    Route::get('/bots/{id}/edit', [TradingBotController::class, 'edit'])->name('bots.edit');

    Route::put('/bots/{id}', [TradingBotController::class, 'update'])->name('bots.update');
    Route::delete('/bots/{id}', [TradingBotController::class, 'destroy'])->name('bots.destroy');
    Route::post('/payments/handle', [PaymentController::class, 'handlePayments'])->name('payments.handle');


    // Réseau
    Route::get('/network', [NetworkController::class, 'index'])->name('network');
    Route::get('/network/{userId}', [NetworkController::class, 'show'])->name('network.show');
    Route::post('/network/verify-distinction/{userId}', [NetworkController::class, 'verifyDistinction']);

    Route::post('/kyc/validate', [UserController::class, 'updateKycStatus'])->name('kyc.validate');
    Route::delete('/kyc/delete/{user_id}', [ProfileController::class, 'deleteKycDocument'])->name('profile.kyc.delete');


    // Transactions
    Route::resource('transactions', TransactionController::class)->only(['index', 'create']);
    Route::post('/transactions/transfer', [TransactionController::class, 'transfer'])->name('transactions.transfer');
    Route::post('/transactions/deposit', [TransactionController::class, 'deposit'])->name('transactions.deposit');
    Route::post('/transactions/withdraw', [TransactionController::class, 'withdraw'])->name('transactions.withdraw');
    Route::post('/transactions/{transactionId}/confirm', [TransactionController::class, 'confirm'])->name('transactions.confirm');
    Route::post('/transactions/{transactionId}/cancel', [TransactionController::class, 'cancel'])->name('transactions.cancel');

    Route::get('/api/users', [UserController::class, 'apiIndex'])->name('api.users.index');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy'); // Suppression
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{id}/destroy', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');

    // Route pour l'abonnement à une formation
    Route::post('/user/subscribe/formation', [UserController::class, 'subscribeToFormation'])->name('user.subscribe.formation');

    Route::post('/user/{user}/subscribe/bot', [UserController::class, 'subscribeToBot'])->name('user.subscribe.bot');

    Route::post('/user/{user}/unsubscribe/formation/{formationId}', [UserController::class, 'unsubscribeFromFormation'])->name('user.unsubscribe.formation');

    Route::post('/user/{user}/unsubscribe/bot/{botId}', [UserController::class, 'unsubscribeFromBot'])->name('user.unsubscribe.bot');

    Route::get('/deposit-methods', [DepositMethodController::class, 'index'])->name('deposit-methods.index');
    Route::get('/deposit-methods/{depositMethod}/edit', [DepositMethodController::class, 'edit'])->name('deposit-methods.edit');
    Route::put('/deposit-methods/{depositMethod}', [DepositMethodController::class, 'update'])->name('deposit-methods.update');

});

// Traductions
Route::get('/translations/{locale}', [TranslationController::class, 'index'])->name('translations.index');

// Liste des pays
Route::get('/countries', function () {
    return Country::all();
});

// Monnaies
Route::get('/currencies', [CurrencyController::class, 'index'])->name('currencies.index');

require __DIR__ . '/auth.php';
