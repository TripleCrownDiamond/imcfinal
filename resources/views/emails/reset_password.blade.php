<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('password_reset_email.subject') }}</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h1>{{ __('password_reset_email.greeting') }}</h1>
    <p>{{ __('password_reset_email.line_1') }}</p>
    <a href="{{ $url }}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        {{ __('password_reset_email.action') }}
    </a>
    <p>{{ __('password_reset_email.line_2') }}</p>
</body>
</html>
