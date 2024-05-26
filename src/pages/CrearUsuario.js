import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const CrearUsuario = () => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
        fNacimiento: '',
        password: '',
        observaciones: '',  //pasar a agenda?
        patologias: '',  //pasar a agenda
        entrevistaPresencial: false   //pasar a agenda
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

    const registro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);
        console.log('Llamada a la API');
        try {
            const respuesta = await axios.post('http://localhost:3000/api/usuarios/', formulario);
            console.log('Respuesta:', respuesta.data);
            setMensaje('Usuario registrado exitosamente.');
        } catch (err) {
            console.error('Error:', err); 
            setError('Error: ' + err.response.data.error); 
        } finally {
            setLoading(false);
            console.log('Finalizado exitosamente');
        }
    };

    return (
        <div>
            <h1>Registro de Usuarios</h1>
            <form onSubmit={registro}>
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
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="fNacimiento"
                        value={formulario.fNacimiento}
                        onChange={eventoCambio}
                        required
                    />
                </div>
                <div>
                    <label>Usted posee patologias?</label>
                    <input
                        type="text"
                        name="patologias"
                        value={formulario.patologias}
                        onChange={eventoCambio}
                    />
                </div>
                <div>
                    <label>Observaciones</label>
                    <input
                        type="text"
                        name="observaciones"
                        value={formulario.observaciones}
                        onChange={eventoCambio}
                    />
                </div>
                <div>
                    <label>prefiere cita virtual</label>
                    <input
                        type="checkbox"
                        name="citaVirtual"
                        value={formulario.entrevistaPresencial}
                        onChange={eventoCambio}
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
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formulario.password}
                        onChange={eventoCambio}
                        required
                    />
                </div>


                {/* <button type="submit" disabled={loading}>Registrar</button> */}
                <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
        // onClick={eventoCambio}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
      </Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default CrearUsuario;
