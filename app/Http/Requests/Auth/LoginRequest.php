<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login' => ['required', 'string'], // Utiliser 'login' au lieu de 'email'
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'login.required' => trans('login.login_required') || "Le champ e-mail ou nom d'utilisateur est obligatoire.",
            'login.string' => trans('login.login_string') || "Le champ e-mail ou nom d'utilisateur doit être une chaîne valide.",
            'password.required' => trans('login.password_required') || "Le champ mot de passe est obligatoire.",
            'password.string' => trans('login.password_string') || "Le mot de passe doit être une chaîne valide.",
        ];
    }


    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginField = $this->input('login');
        $credentials = ['password' => $this->input('password')];

        // Vérifie si le champ de connexion est un email ou un nom d'utilisateur
        if (filter_var($loginField, FILTER_VALIDATE_EMAIL)) {
            $credentials['email'] = $loginField;
        } else {
            $credentials['username'] = $loginField; // Assurez-vous que 'username' est un champ dans votre modèle User
        }

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'login' => trans('login.auth_failed') || "Connexion échouée",
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('login')).'|'.$this->ip());
    }
}
