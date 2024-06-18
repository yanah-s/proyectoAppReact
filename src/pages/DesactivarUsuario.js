import React, { useState } from 'react';
import axios from 'axios';

const DesactivarUsuario = () => {
    const [formulario, setFormulario] = useState({
      
        email: '',
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

    const desactivaUsuario = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);
        console.log('Llamada a la API');
        try {
           const respuesta = await axios.delete(`http://localhost:3000/api/usuarios/${formulario.email}`);
           
           console.log('Respuesta:', respuesta.data);
            setMensaje('Usuario eliminado exitosamente.');
        }  catch (err) {
            console.error('Error:', err);
            let errorMsg = 'Error de conexión';
            
            //Verificamos si hay respuesta del servidor
            if (err.response) {
                 if (err.response.data && err.response.data.mensaje) {
                    errorMsg = err.response.data.mensaje;
                } else if (err.response.data && err.response.data.error) {
                    errorMsg = err.response.data.error;
                } else if (err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else {
                    // cualquier otro caso de error
                    errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
                }
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
            console.log('Finalizado exitosamente');
        }
    };

    return (
        <div>
            <h1>Eliminar Usuarios</h1>
            <form onSubmit={desactivaUsuario}>

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
               
                <button type="submit" disabled={loading}>Eliminar usuario</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default DesactivarUsuario;