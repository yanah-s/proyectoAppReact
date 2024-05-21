import React, { useState } from 'react';
import axios from 'axios';

const EditarUsuario = () => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
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
        } catch (err) {
            console.error('Error', err);
            setError('Error en edición: ' + err.message);
        } finally {
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
                <button type="submit" disabled={loading}>Editar</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default EditarUsuario;