export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/img/logo.png"
            alt="Application Logo"
            style={{
                width: '150px', // Ajustez la largeur si nécessaire
                height: 'auto', // Ajustez la hauteur si nécessaire
            }}
        />
    );
}
