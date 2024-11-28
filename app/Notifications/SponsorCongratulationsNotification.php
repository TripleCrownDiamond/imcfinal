<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SponsorCongratulationsNotification extends Notification
{
    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Félicitations pour votre nouveau parrainage !')
            ->view('emails.sponsor_congratulations_email', ['sponsor' => $notifiable, 'user' => $this->user]);
    }
    

}
