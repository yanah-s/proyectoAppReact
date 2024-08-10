
// import React, { useState ,useEffect } from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import AvanceEjercicios from '../components/AvanceEjercicios';
// import AvancePesoAlumno from '../components/AvancePesoAlumno';
// import PorcentajeAsitencia from '../components/PorcentajeAsitencia';
// import ReactDOM from 'react-dom';

// const tema = createTheme({
//     palette: {
//       primary: {
//         main: '#212529',
//       },
//       secondary: {
//         main: '#757575',
//       },
//       error: {
//         main: '#ff5252',
//       },
//       background: {
//         // default: '#121212',
//         default: '#212529',
//         // paper: '#1d1d1d',
//               paper: '#212529',
//       },
//       text: {
//         primary: '#ffffff',
//         secondary: '#bdbdbd',
//       },
//     },
//     typography: {
//       h4: {
//         fontSize: '2rem',
//         color: '#e0e0e0',
//       },
//     },
//   });


//   const Avances = () => {
//     return (
//       <ThemeProvider theme={tema}>
//         <CssBaseline />
//         <div style={{ padding: 20 }}>
//         <h1>Registra tus avances</h1>
//         <p>Cada 7 días puedes registrar los nuevos avances</p>
//           <Grid container spacing={6}> {/* Ajusta el valor de spacing aquí */}
            
//             <Grid item xs={12} md={6}>
//               <Paper style={{ padding: 20 }}>
//               <h1>     Progresión KG     </h1>
//               <br></br>
//                 <AvanceEjercicios />
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={6}>
              
//             <Paper style={{ padding: 20 }}>
//                 <PorcentajeAsitencia />
//               </Paper>
//               <br></br>
//               <Paper style={{ padding: 20 }}>
//               <h1>  Peso corporal   </h1>
//                 <AvancePesoAlumno />
//                 <br></br>
//               </Paper>
//             </Grid>
//           </Grid>
//         </div>
//       </ThemeProvider>
//     );
//   }

// export default Avances;

import React from 'react';
import { Button, CssBaseline, Grid, Paper, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AvanceEjercicios from '../components/AvanceEjercicios';
import AvancePesoAlumno from '../components/AvancePesoAlumno';
import PorcentajeAsitencia from '../components/PorcentajeAsitencia';

const tema = createTheme({
    palette: {
        primary: {
            main: '#212529',
        },
        secondary: {
            main: '#757575',
        },
        error: {
            main: '#ff5252',
        },
        background: {
            default: '#121212',
            paper: '#212529',
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

const Avances = () => {
    return (
        <ThemeProvider theme={tema}>
            <CssBaseline />
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Registra tus avances
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Cada 7 días puedes registrar los nuevos avances
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c' }}>
                            <Typography variant="h5" gutterBottom>
                                Progresión KG
                            </Typography>
                            <AvanceEjercicios />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c', marginBottom: 2 }}>
                            {/* <Typography variant="h5" gutterBottom>
                                Porcentaje de Asistencia
                            </Typography> */}
                            <PorcentajeAsitencia />
                        </Paper>
                        <Paper sx={{ padding: 3, backgroundColor: '#2c2c2c' }}>
                            <Typography variant="h5" gutterBottom>
                                Peso corporal
                            </Typography>
                            <AvancePesoAlumno />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

export default Avances;
