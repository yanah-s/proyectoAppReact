import React from 'react';
import AppRoutes from './routes'; 
import { Button, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
const tema = createTheme({
    palette: {
        primary: {
            main: '#424242', // Gris oscuro
        },
        secondary: {
            main: '#757575', // Gris medio
        },
        error: {
            main: '#ff5252', // Rojo claro
        },
        background: {
            default: '#121212', // Fondo casi negro
            paper: '#1d1d1d', // Fondo de papel gris oscuro
        },
        text: {
            primary: '#ffffff', // Texto blanco
            secondary: '#bdbdbd', // Texto gris claro
        },
    },
    typography: {
        h4: {
            fontSize: '2rem',
            color: '#e0e0e0', // Texto h4 en gris claro
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={tema}>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            Avance.FIT
                        </Typography>
                    </Toolbar>
                </AppBar>
                <header className="App-header">
                        <AppRoutes />
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
