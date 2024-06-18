import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LocalizationProvider, DateCalendar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

import { DatePicker } from '@mui/x-date-pickers';


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



const DisponibilidadAgenda = () => {
  const [formulario, setFormulario] = useState({
    datos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectAM, setSelectAM] = useState(null);
  const [selectPM, setSelectPM] = useState(null);

  const eventoFechaClick = (date) => {
    setFechaSeleccionada(date);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTimeChangeAM = (newValue) => {
    setSelectAM(newValue);
  };

  const handleTimeChangePM = (newValue) => {
    setSelectPM(newValue);
  };

  const agregarDisponibilidad = () => {
    if (!fechaSeleccionada || !selectAM || !selectPM) {
      setError(["Debe completar fecha, hora de inicio y fin"]);
      return;
    }
  
    // Combinar fecha seleccionada con hora de inicio y fin
    const fechaStr = fechaSeleccionada.format('YYYY-MM-DD');
    const newHoraInicio = dayjs(fechaStr + 'T' + dayjs(selectAM).format('HH:mm:ss'));
    const newHoraFin = dayjs(fechaStr + 'T' + dayjs(selectPM).format('HH:mm:ss'));
  
    if (newHoraInicio.isAfter(newHoraFin)) {
      setError(["Horario incorrecto, verifique disponibilidad"]);
      return;
    }
  
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      datos: {
        ...prevFormulario.datos,
        [fechaSeleccionada.format('YYYY-MM-DD')]: {
          hora_desde: newHoraInicio.format(),  // Cambiado a formato local
          hora_hasta: newHoraFin.format()  // Cambiado a formato local
        },
      }
    }));
    setSelectAM(null);
    setSelectPM(null);
    setOpenModal(false);
    setError([]);
  };

  const marcarDisponibilidad = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    setMensaje(null);

    try {
      await axios.post('http://localhost:3000/api/agenda/', formulario);
     // console.log(formulario);
    
      setMensaje('Disponibilidad registrada exitosamente');
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

  return (
    <ThemeProvider theme={tema}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Marcar disponibilidad
              </Typography>
              <Box component="form" noValidate onSubmit={marcarDisponibilidad} sx={{ mt: 1 }}>
                <DateCalendar
                  value={fechaSeleccionada}
                  onChange={(newValue) => {
                    console.log(newValue);
                    setFechaSeleccionada(newValue);
                    eventoFechaClick(newValue);
                  }}
                  slotProps={{
                    day: {
                      sx: {
                        "&.MuiPickersDay-root.Mui-selected": {
                          backgroundColor:  "red",
                        },
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                </Button>
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
          <Grid item xs={12} sm={12} md={7}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: tema.palette.text.primary }}>Día</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Inicio</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Fin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(formulario.datos).map(([fecha, horario], index) => (
                      <TableRow key={index}>
                        <TableCell style={{ color: tema.palette.text.primary }}>
                          {dayjs(fecha).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell style={{ color: tema.palette.text.primary }}>
                          {horario.hora_desde ? dayjs(horario.hora_desde).format('HH:mm') : ''}
                        </TableCell>
                        <TableCell style={{ color: tema.palette.text.primary }}>
                          {horario.hora_hasta ? dayjs(horario.hora_hasta).format('HH:mm') : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
        >
          <Fade in={openModal}>
            <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Horas disponibles para el {fechaSeleccionada && fechaSeleccionada.format('YYYY-MM-DD')}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Selecciona disponibilidad AM
              </Typography>
              <TimePicker
                label="Selecciona una hora"
                value={selectAM}
                onChange={handleTimeChangeAM}
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography id="modal-modal-description">Selecciona disponibilidad PM</Typography>
              <TimePicker
                label="Selecciona una hora"
                value={selectPM}
                onChange={handleTimeChangePM}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={agregarDisponibilidad}
              >
                Confirmar
              </Button>
            </Box>
          </Fade>
        </Modal>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DisponibilidadAgenda;
