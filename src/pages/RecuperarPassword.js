import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
} from '@mui/material';

const RecuperarPassword = ({ handleClose }) => {
  const [formulario, setFormulario] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const recuperar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);
    console.log('Llamada a la API');
    try {
      const respuesta = await axios.post('http://localhost:3000/api/usuarios/recuperar-passw', formulario);
      console.log('Respuesta:', respuesta.data);
      setMensaje('Solicitud de recuperación enviada.');
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
      console.log('Finalizado exitosamente');
    }
  };

  return (
    <div>
      <form onSubmit={recuperar}>
        <div>
          <TextField
            type="email"
            name="email"
            label="Correo:"
            value={formulario.email}
            onChange={eventoCambio}
            required
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Recuperar Contraseña'}
        </Button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {mensaje && <p>{mensaje}</p>}
      </form>
      <Button onClick={handleClose} color="secondary">Cancelar</Button>
    </div>
  );
};

export default RecuperarPassword;
