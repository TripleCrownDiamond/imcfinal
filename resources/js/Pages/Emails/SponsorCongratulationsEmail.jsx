import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SponsorCongratulationsEmail({ sponsor, user }) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
            <ApplicationLogo />
            <h1>Félicitations, {sponsor.first_name} !</h1>
            <p>
                Un nouvel utilisateur, {user.first_name} {user.last_name}, s'est inscrit en utilisant votre code de parrainage.
            </p>
            <p>Merci pour votre contribution à notre communauté !</p>
        </div>
    );
}
