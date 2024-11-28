<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeUserNotification extends Notification
{
    public function __construct()
    {
        // Ajoutez ici des données supplémentaires si nécessaire
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur notre application !')
            ->view('emails.welcome_email', ['user' => $notifiable]);
    }

}
