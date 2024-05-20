import React, { useState } from 'react';
import axios from 'axios';

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        fNacimiento: '',
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

    const registro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        console.log('Llamada a la API');
        try {
            const response = await axios.post('http://localhost:3000/api/usuarios/', formData);
            console.log('Respuesta:', response.data);
            setSuccessMessage('Usuario registrado exitosamente.');
        } catch (err) {
            console.error('Error', err);
            setError('Error en registro: ' + err.message);
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
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="fNacimiento"
                        value={formData.fNacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>Registrar</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default CrearUsuario;
