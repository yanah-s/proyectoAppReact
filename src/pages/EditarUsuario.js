import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';
// import { Alert, AlertTitle } from '@mui/material';


const EditarUsuario = () => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',  //aca capturar el mail
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    const eventoCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const editarUsuario = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);
        console.log('Llamada a la API');
        try {
           const respuesta = await axios.put(`http://localhost:3000/api/usuarios/${formulario.email}`, formulario);
           
           console.log('Respuesta:', respuesta.data);
            setMensaje('Usuario editado exitosamente.');
        }  catch (err) {
            console.error('Error:', err); 
            setError('Error en edición: ' + err.response.data.error); // Captura el mensaje de error desde la respuesta de la API
        }  finally {
            setLoading(false);
            console.log('Finalizado exitosamente');
        }
    };

    return (
        <div>
            <h1>Edición de Usuarios</h1>
            <form onSubmit={editarUsuario}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={eventoCambio}
                        required
                    />
                </div>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        name="email"
                        value={formulario.email}
                        onChange={eventoCambio}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formulario.password}
                        onChange={eventoCambio}
                        required
                    />
                </div>
                <div>
                    <label>Alumno:</label>
                    <input
                        type="checkbox"
                        name="alumno"
                        value={formulario.alumno}
                        onChange={eventoCambio}
                    />
                </div>
                {/* <button type="submit" disabled={loading}>Editar</button> */}

                <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                onClick={editarUsuario}
                >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar usuario'}
                </Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {mensaje && <p>{mensaje}</p>}

{/* 
                    {error && (
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
            </Alert>
            )}
            {valor && (
                <Alert severity="success">
                    <AlertTitle>Éxito</AlertTitle>
                    Usuario actualizado correctamente
                </Alert>
            )} */}
        </div>
        
    );
};

export default EditarUsuario;
