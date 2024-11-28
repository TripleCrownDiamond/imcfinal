<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = url(route('password.reset', $this->token, false));
        
        return (new MailMessage)
            ->subject(__('password_reset_email.subject', [], 'fr') ?? 'Réinitialisation de votre mot de passe')
            ->greeting(__('password_reset_email.greeting', [], 'fr') ?? 'Bonjour,')
            ->line(__('password_reset_email.line_1', [], 'fr') ?? 'Vous avez demandé à réinitialiser votre mot de passe.')
            ->action(__('password_reset_email.action', [], 'fr') ?? 'Réinitialiser le mot de passe', $resetUrl)
            ->line(__('password_reset_email.line_2', [], 'fr') ?? 'Si vous n\'avez pas demandé de réinitialisation, veuillez ignorer ce message.')
            ->view('emails.reset_password', ['url' => $resetUrl]);
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            // Données supplémentaires si nécessaire
        ];
    }
}
