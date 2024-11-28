<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Félicitations pour votre nouveau parrainage</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="text-align: center; padding: 20px;">
        <img src="https://auth.imarket-consulting.com/img/logo.png" alt="Application Logo" style="width: 150px; height: auto;">
    </div>
    <h1>Félicitations, {{ $sponsor->first_name }} !</h1>
    <p>
        Un nouvel utilisateur, {{ $user->first_name }} {{ $user->last_name }}, s'est inscrit en utilisant votre code de parrainage.
    </p>
    <p>Merci pour votre contribution à notre communauté !</p>
</body>
</html>
