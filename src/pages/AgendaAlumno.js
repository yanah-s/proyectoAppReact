import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Paper,
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import api from '../configuracion/axiosconfig';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './AgendaUsuarios.css';
import { useNavigate } from 'react-router-dom';

const tema = createTheme({
  palette: {
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

const AgendaAlumno = () => {
  const [disponibilidad, setDisponibilidad] = useState([]); //donde se almacenan todos los turnos disponibles, 
  //apenas se carga la pagina, consulta disponibilidad.
  const [selectedTurnos, setSelectedTurnos] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const response = await api.get('/api/agenda'); 
       setDisponibilidad(response.data);
      } catch (error) {
        console.error('Error al obtener la disponibilidad de agenda:', error);
      }
    };
    
    fetchDisponibilidad();
  }, []);


  const handleSubmitAgenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    setMensaje(null);

   try {
     
      
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      console.log("usuarioid   :" + usuario.id + "token" + token);
      const dataAgenda = {
        usuarioId: usuario.id, 
        turnoId : selectedTurnos,
      };
      const responseAgenda = await api.put('/api/agenda/',dataAgenda, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
      });
      setMensaje('Turno agendado exitosamente.');
    
    } catch (err) {
      let errorMsg = 'Error de conexión';

      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          setError(err.response.data.errors);
        } else if (err.response.data && err.response.data.message) {
          setError([err.response.data.message]);
        } else {
          errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
          setError([errorMsg]);
        }
      } else {
        setError([errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleTurnoChange = (turnoId) => {
    setSelectedTurnos(prev => (prev === turnoId ? null : turnoId));
  };


  const seleccionTurno = () => {
    setOpenModal(false);
  };
  

  //al hacer click en una fecha, se guarda la misma en el estado y se abre el modal
  const eventoFechaClick = (date) => {
    setFechaSeleccionada(date);
    setOpenModal(true);
  };

  //se cierra modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //chequea en todos los turnos disponbles cuales corresponden al turno/dia seleccionado
  const turnosDisponiblesParaFecha = disponibilidad.filter(turno => 
    dayjs(turno.fecha).isSame(fechaSeleccionada, 'day')
  );

  const shouldDisableDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().startOf('day');
  
    // Comparar la fecha con la de hoy
    if (dayjs(formattedDate).isBefore(today, 'day')) {
      return true; // Deshabilitar fechas pasadas
    }

    return !disponibilidad.some(turno => dayjs(turno.fecha).format('YYYY-MM-DD') === formattedDate);
  };




return (
  <ThemeProvider theme={tema}>
    <CssBaseline />
  
    <Grid container component="main" sx={{ height: '100vh',
       justifyContent: 'center', alignItems: 'center' }}>


      <Grid item xs={12} md={8} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
           <p>Si deseas que nos reunamos para tener una consulta de evaluación, agenda tu cita:</p> 

          <Box component="form" noValidate sx={{ mt: 1 }}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => {
                  setFechaSeleccionada(newValue);
                  eventoFechaClick(newValue);
                }}
              
                shouldDisableDate={shouldDisableDate}
                customclassname={{ disabled: 'custom-disabled' }}
              />
            </LocalizationProvider>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Preferiría mi consulta de forma presencial"
            />
            <TextField
              margin="normal"
              fullWidth
              id="observaciones"
              label="Motivo de la consulta"
              name="observaciones"
              autoComplete="observaciones"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={handleSubmitAgenda}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'AGENDAR'}
            </Button>
            {error.length > 0 && (
              <Alert severity="error">
                {error.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </Alert>
            )}
             {error.length > 0 && (
              <Alert severity="error">
                {error.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </Alert>
            )}
            {mensaje && <Typography color="success.main">{mensaje}</Typography>}
          </Box>
        </Box>
      </Grid>

      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={openModal}>
          <Box sx={{ 
            width: 400, 
            bgcolor: 'background.paper', 
            p: 2, 
            maxHeight: '80vh',  // Altura máxima del modal
            overflowY: 'auto',  // Habilitar scroll vertical 
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Horas disponibles para el {fechaSeleccionada && fechaSeleccionada.format('DD/MM/YYYY')}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hora</TableCell>
                    <TableCell>Seleccionar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {turnosDisponiblesParaFecha.map((turno) => (
                <TableRow key={turno._id}>
                  <TableCell>{dayjs(turno.hora_desde).format('HH:mm')}</TableCell>
                  <TableCell>{dayjs(turno.hora_hasta).format('HH:mm')}</TableCell>
                  <TableCell>
                  <Checkbox
                      checked={selectedTurnos === turno._id}
                      onChange={() => handleTurnoChange(turno._id)}
                    />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={seleccionTurno}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SELECCIONAR TURNO'}
            </Button>
          </Box>
        </Fade>
      </Modal>
      
  </ThemeProvider>
);
}
export default AgendaAlumno;

