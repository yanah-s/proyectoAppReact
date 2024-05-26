
import React, { useState } from 'react';
import axios from 'axios';
import EditarUsuario from './EditarUsuario';
import { Button, CircularProgress,  Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper } from '@mui/material';
    import { Link } from 'react-router-dom'; 

const ListarUsuarios = () => {
    const [usuarios, cargarUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const traerUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const respuesta = await axios.get('http://localhost:3000/api/usuarios');
            cargarUsuarios(respuesta.data);
        } catch (err) {
            console.error('Error cargando usuarios:', err); 
            setError('Error cargando usuarios : ' + err.message);
        } finally {
            setLoading(false);
            console.log('completado exitosamente'); 
           
        }
    };

    const mostrarAlumno = (alumno) => {
        return alumno ? 'Sí' : 'No';
    };
    return (
        <div>
            <h1>Lista de Usuarios</h1>
            {/* <button onClick={traerUsuarios}>Listar Usuarios</button> 

            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>} */}
            
           
        <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
        onClick={traerUsuarios}
        
        >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Listar!'}
        </Button>
        

            <TableContainer component={Paper} style={{ display: usuarios.length === 0 ? 'none' : 'block' }}>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        {/* Agrega más columnas según tus datos */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>{usuario.nombre}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>{usuario.alumno}</TableCell>
                            <TableCell>{mostrarAlumno(usuario.alumno)}</TableCell>
                            <TableCell>
                                    {/* <Link to={`.././EditarUsuario/${usuario.email}`} style={{ textDecoration: 'none' }}> */}
                                        <Link to={`.././EditarUsuario/${usuario.email}`} style={{ textDecoration: 'none' }}>
                                    
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="button"
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
                                        </Button>
                                    </Link>
                                </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
};

export default ListarUsuarios;
