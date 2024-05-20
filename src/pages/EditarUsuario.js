import React, { useState } from 'react';
import axios from 'axios';

const EditarUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const editar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        console.log('Llamada a la API');
        try {
            const response = await axios.post(`http://localhost:3000/api/usuarios/${formData.email}`, formData);
            console.log('Respuesta:', response.data);
            setSuccessMessage('Usuario editado exitosamente.');
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
            <form onSubmit={editar}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>Editar</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default EditarUsuario;
