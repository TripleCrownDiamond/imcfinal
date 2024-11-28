<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email</title>
    <style>
        /* Ajout du style global pour le bouton */
        .primary-button {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background-color: #88ae75;
            text-decoration: none;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: background-color 0.15s ease-in-out;
        }

        .primary-button:hover {
            background-color: #cd8b76;
        }

        .primary-button:focus {
            background-color: #cd8b76;
            outline: none;
            box-shadow: 0 0 0 2px #88ae75;
        }

        .primary-button:active {
            background-color: #5b6f45;
        }
    </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="text-align: center; padding: 20px;">
        <img src="https://auth.imarket-consulting.com/img/logo.png" alt="Logo de l'application" style="width: 150px; height: auto;">
    </div>
    <h1>Bienvenue, {{ $user->first_name }} !</h1>
    <p>
        Merci de vous être inscrit. Nous sommes heureux de vous accueillir parmi nous.
    </p>
    <p>
        Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
    </p>
    <p>
        <a href="{{ $url }}" class="primary-button">
            Vérifier mon email
        </a>
    </p>
    <p>Si vous n'avez pas créé ce compte, aucune action n'est nécessaire.</p>
    <p>Merci d'utiliser notre application !</p>
</body>
</html>
