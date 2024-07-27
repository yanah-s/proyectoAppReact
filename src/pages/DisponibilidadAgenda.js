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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LocalizationProvider, DateCalendar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import api from '../configuracion/axiosconfig';
import { DatePicker } from '@mui/x-date-pickers';
import './DisponibilidadAgenda.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isToday, set } from 'date-fns';
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
  const [disponibilidad, setDisponibilidad] = useState({
    data: [],
  });; //donde se almacenan todos los turnos disponibles,
  //apenas se carga la pagina, consulta disponibilidad.
  const [turnosOcupados, setTurnosOcupados] = useState([]); //se carga con los datos de disponibilidad
  const [turnosLibres, setTurnosLibres] = useState([]);//se carga con los datos de disponibilidad
  const [formulario, setFormulario] = useState({
    datos: [],
  }); //se carga con los datos que el usuario sube como disponibilidad
  const [openModal, setOpenModal] = useState(false);
  const [selectAM, setSelectAM] = useState(null);
  const [selectPM, setSelectPM] = useState(null);
// ------------------------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeTabla, setMensajeTabla] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [activeTab, setActiveTab] = useState('table2');


  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {

        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);
        const response = await api.get('api/agenda/turnos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        console.log(response.data); // Verifica que recibas los datos correctos
  
        // Establecer la disponibilidad en el estado
        setDisponibilidad(response.data);
  
        // Filtrar turnos ocupados
        const ocupados = response.data.filter(item => item.usuario !== null);
        setTurnosOcupados(ocupados);
  
        // Filtrar turnos libres
        const libres = response.data.filter(item => item.usuario === null);
        setTurnosLibres(libres);
  
      } catch (error) {
        console.error('Error al obtener la disponibilidad de agenda:', error);
      }
    };
  
    fetchDisponibilidad();
  }, []);
  

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
  const shouldDisableDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().startOf('day');
  
    // Comparar la fecha con la de hoy
    if (dayjs(formattedDate).isBefore(today, 'day')) {
      return true; // Deshabilitar fechas pasadas
    }
  
    // Verificar si disponibilidad es un array y no está vacío
    if (!Array.isArray(disponibilidad) || disponibilidad.length === 0) {
      return false; // Habilitar la fecha si disponibilidad no está definido o vacío
    }
  
    // Verificar si la fecha está en disponibilidad
    const fechaEnDisponibilidad = disponibilidad.some(turno => dayjs(turno.fecha).isSame(formattedDate, 'day'));
    
    if (fechaEnDisponibilidad) {
      return true; // Deshabilitar fechas que ya están en disponibilidad
    }
    // Habilitar la fecha si no está en disponibilidad y es de hoy en adelante
    return false;
};

  const quitarTurnoDeAgenda = async (idTurno, index) => {
    
    setError([]);
    setMensaje(null);
    
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      const response = await api.delete(`api/agenda/${idTurno}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      
     setMensajeTabla(response.data);

       
     setTurnosLibres((prevTurnosLibres) => {
      // Crear una copia del array de turnos sin el eliminado
      return prevTurnosLibres.filter((_, i) => i !== index);
    });
  } catch (error) {
    console.error('Error al eliminar turno', error);
  }

  };
  

  const quitarDisponibilidad = (index) => {
    setError([]);
    setMensaje(null);
    const nuevosDatos = { ...formulario.datos };
    // Eliminar el elemento del array 
    delete nuevosDatos[Object.keys(nuevosDatos)[index]];
    // Actualizar el estado 
    setFormulario({ datos: nuevosDatos });

   }
 
  
  const agregarDisponibilidad = () => {
    if (!fechaSeleccionada || !selectAM || !selectPM) {
      setError(['Debe completar fecha, hora de inicio y fin']);
      return;
    }

    // Combinar fecha seleccionada con hora de inicio y fin
    const fechaStr = fechaSeleccionada.format('YYYY-MM-DD');
    const newHoraInicio = dayjs(fechaStr + 'T' + dayjs(selectAM).format('HH:mm:ss'));
    const newHoraFin = dayjs(fechaStr + 'T' + dayjs(selectPM).format('HH:mm:ss'));

    if (newHoraInicio.isAfter(newHoraFin)) {
      setError(['Horario incorrecto, verifique disponibilidad']);
      return;
    }

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      datos: {
        ...prevFormulario.datos,
        [fechaSeleccionada.format('YYYY-MM-DD')]: {
          hora_desde: newHoraInicio.format(), 
          hora_hasta: newHoraFin.format(),
        },
      },
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
      if(Object.keys(formulario.datos).length > 0){
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      console.log("usuarioid   :" + usuario.id + "token" + token);

      await api.post('api/agenda/', formulario, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      setMensaje('Disponibilidad registrada exitosamente');

      const nuevosDatos = { ...formulario.datos };
      Object.keys(nuevosDatos).forEach(key => delete nuevosDatos[key]);
      setFormulario({ datos: nuevosDatos });
      }else{
        setError(['Debe seleccionar turnos en la agenda']);
      }
      

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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMensaje(null);
    setError([]);
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
            <Box component="form" noValidate onSubmit={marcarDisponibilidad} sx={{ mt: 1 }}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => {
                  console.log(newValue);
                  setFechaSeleccionada(newValue);
                  eventoFechaClick(newValue);
                }}
                shouldDisableDate={shouldDisableDate}
                slotProps={{
                  day: {
                    sx: {
                      "&.MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "red",
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
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ul className="nav nav-tabs nav-justified">
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'table1' ? 'active' : ''}`} href="#" onClick={() => handleTabClick('table1')}>
              Nueva disponibilidad
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'table2' ? 'active' : ''}`} href="#" onClick={() => handleTabClick('table2')}>
              Disponibilidad Actual
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'table3' ? 'active' : ''}`} href="#" onClick={() => handleTabClick('table3')}>
              Turnos Ocupados
            </a>
          </li>
        </ul>

            <div id="table1" className="table-content" style={{ display: activeTab === 'table1' ? 'block' : 'none' }}>
            
                <TableContainer className='tablaDisponibilidad' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: tema.palette.text.primary }}>Día</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Inicio</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Fin</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Quitar</TableCell>
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
                        <TableCell>
                      {/* <Button color="secondary" onClick={() => quitarTurno(item._id)}>Quitar</Button>
                     */}
                      <Button color="secondary" onClick={() => quitarDisponibilidad(index)}>Quitar</Button>
                    
                    </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div id="table2" className="table-content" style={{ display: activeTab === 'table2' ? 'block' : 'none' }}>

              <TableContainer className='tablaDisponibilidad' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: tema.palette.text.primary }}>Fecha</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora inicio</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Fin</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                {turnosLibres.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{dayjs(item.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{item.hora_desde ? dayjs(item.hora_desde).format('HH:mm') : ''}</TableCell>
                    <TableCell>{item.hora_hasta ? dayjs(item.hora_hasta).format('HH:mm') : ''}</TableCell>
                    <TableCell>
                      <Button color="secondary" onClick={() => quitarTurnoDeAgenda(item._id, index)}>Quitar</Button>
                    </TableCell>
                  </TableRow>
                ))}
                 </TableBody>
                </Table>
              </TableContainer>
              
            </div>

            <div id="table3" className="table-content" style={{ display: activeTab === 'table3' ? 'block' : 'none' }}>
              <TableContainer className='tablaDisponibilidad' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: tema.palette.text.primary }}>Fecha</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora inicio</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Hora Fin</TableCell>
                      <TableCell style={{ color: tema.palette.text.primary }}>Cliente</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {turnosOcupados.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{dayjs(item.fecha).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{item.hora_desde ? dayjs(item.hora_desde).format('HH:mm') : ''}</TableCell>
                    <TableCell>{item.hora_hasta ? dayjs(item.hora_hasta).format('HH:mm') : ''}</TableCell>
                    {/* <TableCell>{item.usuario ? `${item.usuario.nombre}` : 'Sin asignar'}</TableCell> */}
                    <TableCell>{item.usuario ? item.usuario.nombre : 'Sin asignar'}</TableCell>
                  </TableRow>
                ))}
                  </TableBody>
                </Table>
                
              </TableContainer>
             
            </div>
            {mensajeTabla && <Typography color="success.main">{mensajeTabla}</Typography>}
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
