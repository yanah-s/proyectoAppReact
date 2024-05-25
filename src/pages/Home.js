import React from 'react';
import { Button } from '@mui/material';


const Home = () => {
    const agendar = () => {
        // Lógica para manejar el click del botón
        console.log('¡Agéndate!');
    };

    return (
        <div>
            <h1>Bienvenido!</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={agendar}
            >
                Agéndate!
            </Button>
            <h3> texto de la cliente</h3>
        </div>
    );
};

export default Home;
