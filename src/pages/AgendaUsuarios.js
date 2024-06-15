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
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LocalizationProvider, DateCalendar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

const AgendaUsuarios = () => {
  const [disponibilidad, setDisponibilidad] = useState([]); //donde se almacenan todos los turnos disponibles, 
  //apenas se carga la pagina, consulta disponibilidad.
  const [selectedTurnos, setSelectedTurnos] = useState({});
  const [formulario, setFormulario] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [openModal, setOpenModal] = useState(false);


  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/obtenerDisponibilidad'); 
        setDisponibilidad(response.data);
      } catch (error) {
        console.error('Error al obtener la disponibilidad de agenda:', error);
      }
    };

    fetchDisponibilidad();
  }, []);
 

  //checkbox para seleccionar el turno actualiza de true a false o al reves
  const handleTurnoChange = (turno) => {
    setSelectedTurnos(prev => ({
      ...prev,
      [turno.hora]: !prev[turno.hora]
    }));
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

//llamada a la api para enviar el turno con informacion completa.
  const agendar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    setMensaje(null);
  
    try {
      const hora = Object.keys(selectedTurnos).filter(hora => selectedTurnos[hora]);
      // const idUsuario = ..;
      // const info extra.

      const data = {
        fecha: fechaSeleccionada.format('YYYY-MM-DD'),
        horaSeleccionada: hora
        //debe viajar tambien la informacion del usuario referente a la entrevista.
        //como lo es observaciones y el check de si prefiere virtual
      };
  
      await axios.post('http://localhost:3000/api/agendarTurnos', data);
  
      setMensaje('Turno agendado!');
      setSelectedTurnos({});
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
  
  const shouldDisableDate = (date) => {
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    // return !disponibilidad.some(turno => turno.fecha === formattedDate);
    return false;
    //EN ESTE MOMENTO DEVUELVE FALSE PARA PODERLO USAR, PERO SI DA TRUE NO DEJA SELECCIONAR FECHA
  };

 // return (
//     <ThemeProvider theme={tema}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

      
           
//               ACA!!!

//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//             <Typography component="h1" variant="h5">
//               Agenda tu turno!
//             </Typography>
//             <Box component="form" noValidate sx={{ mt: 1 }}>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DateCalendar
//                   value={fechaSeleccionada}
//                   onChange={(newValue) => {
//                     setFechaSeleccionada(newValue);
//                     eventoFechaClick(newValue);
//                   }}
//                   shouldDisableDate={shouldDisableDate}
//                 />
//               </LocalizationProvider>
             
//               {error.length > 0 && (
//                 <Alert severity="error">
//                   {error.map((e, i) => (
//                     <div key={i}>{e}</div>
//                   ))}
//                 </Alert>
//               )}
//               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//             </Box>
//           </Box>
//         </Grid>
//         <Grid item xs={12} sm={12} md={7}>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//           </Box>
//         </Grid>
//       </Grid>
//       <Modal
//   open={openModal}
//   onClose={handleCloseModal}
//   aria-labelledby="modal-modal-title"
//   aria-describedby="modal-modal-description"
//   closeAfterTransition
//   BackdropComponent={Backdrop}
//   BackdropProps={{
//     timeout: 500,
//   }}
// >
//   <Fade in={openModal}>
//     <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
//       <Typography id="modal-modal-title" variant="h6" component="h2">
//         Horas disponibles para el {fechaSeleccionada && fechaSeleccionada.format('DD/MM/YYYY')}
//       </Typography>
//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Hora</TableCell>
//               <TableCell>Seleccionar</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {turnosDisponiblesParaFecha.map((turno, index) => (
//               <TableRow key={index}>
//                 <TableCell>{turno.hora}</TableCell>
//                 <TableCell>
//                   <Checkbox
//                     checked={!!selectedTurnos[turno.hora]}
//                     onChange={() => handleTurnoChange(turno)}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Button
//         type="submit"
//         fullWidth
//         variant="contained"
//         sx={{ mt: 3, mb: 2 }}
//         disabled={loading}
//         onClick={agendar}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : 'Agendar'}
//       </Button>
//       {error.length > 0 && (
//         <Alert severity="error">
//           {error.map((e, i) => (
//             <div key={i}>{e}</div>
//           ))}
//         </Alert>
//       )}
//       {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//     </Box>
//   </Fade>
// </Modal>
//     </ThemeProvider>
//   );
// };

return (
  <ThemeProvider theme={tema}>
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
            Agenda tu turno!
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* <TextField
              margin="normal"
              fullWidth
              id="nombre"
              label="Nombre"
              name="nombre"
              autoComplete="nombre"
              autoFocus
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
            /> */}
            <TextField
              margin="observaciones"
              fullWidth
              id="observaciones"
              label="observaciones"
              name="observaciones"
              autoComplete="observaciones"
            //  onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox
                // checked={!!formulario.aceptoTerminos}
                // onChange={(e) => setFormulario({ ...formulario, aceptoTerminos: e.target.checked })}
                color="primary"
              />}
              label="Preferiría mi consulta virtual"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => {
                  setFechaSeleccionada(newValue);
                  eventoFechaClick(newValue);
                }}
                shouldDisableDate={shouldDisableDate}
              />
            </LocalizationProvider>
           
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
                      {disponibilidad.map((turno, index) => (
                        <TableRow key={index}>
                          <TableCell>{turno.hora}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={!!selectedTurnos[turno.hora]}
                              onChange={() => handleTurnoChange(turno)}
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
                  onClick={agendar}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Agendar'}
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
            </Fade>
          </Modal>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>
);
};

export default AgendaUsuarios;

