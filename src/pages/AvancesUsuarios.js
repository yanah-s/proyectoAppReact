// import React, { useState, useEffect } from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, Grid, Paper, Box, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import AvanceEjercicios from '../components/AvanceEjercicios';
// import AvancePesoAlumno from '../components/AvancePesoAlumno';
// import PorcentajeAsitencia from '../components/PorcentajeAsitencia';

// const tema = createTheme({
//   palette: {
//     primary: {
//       main: '#424242',
//     },
//     secondary: {
//       main: '#757575',
//     },
//     error: {
//       main: '#ff5252',
//     },
//     background: {
//       default: '#121212',
//       paper: '#212529' 
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#bdbdbd',
//     },
//   },
//   typography: {
//     h4: {
//       fontSize: '2rem',
//       color: '#e0e0e0',
//     },
//   },
// });

// const AvancesUsuarios = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const listarUsuarios = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const usuario = JSON.parse(localStorage.getItem('usuario'));
//         console.log("logueado" + usuario);
//         const response = await api.get('/api/usuarios', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'User-ID': usuario.id,
//           },
//         });
//         setUsuarios(response.data);
//       } catch (error) {
//         console.error('Error al obtener usuarios:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     listarUsuarios();
//   }, []);

//   const handleUsuarioChange = async (event) => {
//     const usuarioId = event.target.value;
//     setUsuarioSeleccionado(usuarioId);

//     if (usuarioId) {
//       try {
//         setLoading(true);
//         console.log(usuarioSeleccionado);
        
//       } catch (error) {
//         console.error('Error al obtener los avances del usuario:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <ThemeProvider theme={tema}>
//       <CssBaseline />
//       <div style={{ padding: 20 }}>
//         <FormControl fullWidth margin="normal" sx={{ width: '300px' }}>
//           <Select
//             value={usuarioSeleccionado || ''}
//             onChange={handleUsuarioChange}
//             displayEmpty
//             sx={{ backgroundColor: 'white', color: 'black !important' }}
//             disabled={loading} // Desactiva el select mientras se carga
//           >
//             <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
//             {usuarios.map((usuario) => (
//               <MenuItem key={usuario._id} value={usuario._id}>
//                 {usuario.nombre}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Grid container spacing={6}>
//             <Grid item xs={12} md={6}>
//               <Paper style={{ padding: 20 }}>
//                 <Typography variant="h4">Progresión KG</Typography>
//                 <AvanceEjercicios id={usuarioSeleccionado} />
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Paper style={{ padding: 20 }}>
//                 {/* Pasa el usuarioSeleccionado directamente */}
//                 <PorcentajeAsitencia id={usuarioSeleccionado} />
//               </Paper>
//               <Paper style={{ padding: 20, marginTop: 20 }}>
//                 <Typography variant="h4">Peso corporal</Typography>
//                 <AvancePesoAlumno id={usuarioSeleccionado} />
//               </Paper>
//             </Grid>
//           </Grid>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default AvancesUsuarios;
import React, { useState, useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, Grid, Paper, Box, Typography, CircularProgress, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AvanceEjercicios from '../components/AvanceEjercicios';
import AvancePesoAlumno from '../components/AvancePesoAlumno';
import PorcentajeAsitencia from '../components/PorcentajeAsitencia';
import { red } from '@mui/material/colors';

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
      // paper: '#212529'
      paper : red,
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

const AvancesUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listarUsuarios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await api.get('/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id,
          },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    listarUsuarios();
  }, []);

  const handleUsuarioChange = async (event) => {
    const usuarioId = event.target.value;
    setUsuarioSeleccionado(usuarioId);

    if (usuarioId) {
      try {
        setLoading(true);
        // Realiza aquí las operaciones necesarias al cambiar de usuario
      } catch (error) {
        console.error('Error al obtener los avances del usuario:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  const menuProps = {
    PaperProps: {
      style: {
        backgroundColor: '#424242',
        color: 'white',
      },
    },
  };

  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <Box sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <FormControl sx={{ width: '300px', mb: 3 }}>
            {/* <InputLabel sx={{ color: 'white' }}>Selecciona un usuario</InputLabel> */}
            {/* <Select
              value={usuarioSeleccionado || ''}
              onChange={handleUsuarioChange}
              displayEmpty
              sx={{ 
                backgroundColor: '#424242', 
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '.MuiSvgIcon-root ': {
                  fill: 'white !important',
                }
              }}
              disabled={loading}
            >
              <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
              {usuarios.map((usuario) => (
                <MenuItem key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </MenuItem>
              ))}
            </Select> */}
                  <Select
        value={usuarioSeleccionado || ''}
        onChange={handleUsuarioChange}
        displayEmpty
        sx={{ 
          backgroundColor: '#424242', 
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '.MuiSvgIcon-root ': {
            fill: 'white !important',
          },
        }}
        disabled={loading}
        MenuProps={menuProps}
      >
        <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
        {usuarios.map((usuario) => (
          <MenuItem key={usuario._id} value={usuario._id}>
            {usuario.nombre}
          </MenuItem>
        ))}
      </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c' }}>
                <Typography variant="h5" gutterBottom>
                  Progresión KG
                </Typography>
                <AvanceEjercicios id={usuarioSeleccionado} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c', marginBottom: 2 }}>
                {/* <Typography variant="h5" gutterBottom>
                  Porcentaje de Asistencia
                </Typography> */}
                <PorcentajeAsitencia id={usuarioSeleccionado} />
              </Paper>
              <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c' }}>
                <Typography variant="h5" gutterBottom>
                  Peso corporal
                </Typography>
                <AvancePesoAlumno id={usuarioSeleccionado} />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AvancesUsuarios;
