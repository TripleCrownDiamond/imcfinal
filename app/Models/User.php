<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Distinction;
use App\Models\UserDistinction;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'country_id',
        'email',
        'password',
        'uniq_id',
        'balance',
        'sponsor_id',
        'role',
        'visible_password',
        'phone_number'

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    // Relation avec les abonnements
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function distinctions()
    {
        return $this->belongsToMany(Distinction::class, 'user_distinctions')
            ->withPivot('date_acquired')
            ->withTimestamps()
            ->orderBy('user_distinctions.date_acquired', 'desc'); // Trie par date_acquired décroissante
    }


    public function formationSubscriptions()
    {
        return $this->hasMany(FormationSubscription::class);
    }

    public function hasSufficientBalance($amount)
    {
        return $this->balance >= $amount;
    }

    public function deductBalance($amount)
    {
        $this->balance -= $amount;
        $this->save();
    }

    // Définir la relation avec KYC
    public function kyc()
    {
        return $this->hasMany(KYC::class, 'user_id');
    }

    public function addBalance($amount)
    {
        $this->balance += $amount;
        $this->save();
    }



    // Dans le modèle User.php

    public function sponsor()
    {
        // Un utilisateur peut avoir un sponsor, qui est un autre utilisateur
        return $this->belongsTo(User::class, 'sponsor_id', 'uniq_id');
    }

    public function downlines()
    {
        return $this->hasMany(User::class, 'sponsor_id', 'uniq_id');
    }

    public function genealogy($generations = 4)
    {
        $genealogy = [];

        $this->buildGenealogy($this, $genealogy, $generations);

        return $genealogy;
    }

    protected function buildGenealogy($user, &$genealogy, $generationsLeft)
    {
        if ($generationsLeft <= 0) return;

        // Récupérer toutes les downlines de l'utilisateur
        $allDownlines = $user->downlines()->get();

        // Filtrer les downlines selon les critères
        $filteredDownlines = $allDownlines->filter(function ($downline) {
            // Vérifier si la downline a au moins 3 downlines
            $hasThreeDownlines = $downline->downlines()->count() >= 3;

            // Vérifier si la downline a au moins 1 downline
            $hasAtLeastOneDownline = $downline->downlines()->count() > 0;

            return $hasThreeDownlines || $hasAtLeastOneDownline;
        });

        // Récupérer les 3 premières downlines selon les critères
        $selectedDownlines = $filteredDownlines->take(3);

        // Si le nombre sélectionné est insuffisant, compléter avec d'autres downlines
        if ($selectedDownlines->count() < 3) {
            $remainingCount = 3 - $selectedDownlines->count();
            $additionalDownlines = $allDownlines
                ->diff($selectedDownlines)
                ->take($remainingCount);

            $selectedDownlines = $selectedDownlines->merge($additionalDownlines);
        }

        foreach ($selectedDownlines as $downline) {
            // Récupère la première distinction si elle existe
            $distinction = $downline->distinctions->first() ? $downline->distinctions->first()->name : 'Aucune distinction';

            // Ajoute au tableau de généalogie
            $genealogy[] = [
                'username' => $downline->username,
                'distinction' => $distinction,
                'downlines' => []
            ];

            // Récursion pour les générations suivantes
            $this->buildGenealogy($downline, $genealogy[count($genealogy) - 1]['downlines'], $generationsLeft - 1);
        }
    }


    // Dans le modèle User
    public function sponsorGains()
    {
        return $this->hasMany(SponsorGain::class, 'sponsor_uniq_id', 'uniq_id');
    }
}
