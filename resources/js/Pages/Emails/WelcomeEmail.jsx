import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function WelcomeEmail({ user }) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
            <ApplicationLogo />
            <h1>Bienvenue, {user.first_name} !</h1>
            <p>
                Merci de vous être inscrit. Nous sommes heureux de vous accueillir parmi nous.
            </p>
            <p>
                <a href="/" style={{ color: '#3490dc' }}>Visitez notre site</a>
            </p>
            <p>Merci d'utiliser notre application!</p>
        </div>
    );
}
