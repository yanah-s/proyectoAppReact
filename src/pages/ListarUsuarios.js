import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';

const tema = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#424242',
        },
        secondary: {
            main: '#757575',
        },
        error: {
            main: '#ff5252',
        },
        background: {
            default: '#121212',
            paper: '#1d1d1d',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bdbdbd',
        },
    },
    typography: {
        h4: {
            fontSize: '2rem',
            color: '#e0e0e0',
        },
    },
});

const ListarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        traerUsuarios();
    }, []);

    const traerUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const respuesta = await axios.get('http://localhost:3000/api/usuarios');
            setUsuarios(respuesta.data);
        } catch (err) {
            console.error('Error:', err);
            let errorMsg = 'Error de conexión';
            
            if (err.response) {
                if (err.response.data && err.response.data.mensaje) {
                    errorMsg = err.response.data.mensaje;
                } else if (err.response.data && err.response.data.error) {
                    errorMsg = err.response.data.error;
                } else if (err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else {
                    errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
                }
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const mostrarAlumno = (alumno) => {
        return alumno ? 'Sí' : 'No';
    };

    return (
        <ThemeProvider theme={tema}>
            <div style={{ backgroundColor: tema.palette.background.default, minHeight: '100vh', padding: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    onClick={traerUsuarios}
                    style={{ marginBottom: '20px' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Listar'}
                </Button>
                
                {loading && <p style={{ color: tema.palette.text.primary }}>Cargando...</p>}
                {error && <p style={{ color: tema.palette.error.main }}>{error}</p>}

                <Container maxWidth="lg" disableGutters>
                    <Paper style={{ backgroundColor: tema.palette.background.paper, border: 'none' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Nombre</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Email</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Status</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuarios.map((usuario) => (
                                        <TableRow key={usuario.id}>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.nombre}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.email}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.codigoRecuperacion}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.password}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{mostrarAlumno(usuario.alumno)}</TableCell>
                                            <TableCell>
                                                <Link to={`.././EditarUsuario/${usuario.email}`} style={{ textDecoration: 'none' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        type="button"
                                                        disabled={loading}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </div>
        </ThemeProvider>
    );
};

export default ListarUsuarios;
