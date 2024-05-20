
import React, { useState } from 'react';
import axios from 'axios';

const ListarUsuarios = () => {
    const [usuarios, cargarUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const traerUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3000/api/usuarios');
            cargarUsuarios(response.data);
        } catch (err) {
            console.error('Error cargando usuarios:', err); 
            setError('Error cargando usuarios : ' + err.message);
        } finally {
            setLoading(false);
            console.log('completado exitosamente'); 
        }
    };

    return (
        <div>
            <h1>Lista de Usuarios</h1>
            <button onClick={traerUsuarios}>Listar Usuarios</button> {/* Verifica que esto está correctamente */}
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>{usuario.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListarUsuarios;
