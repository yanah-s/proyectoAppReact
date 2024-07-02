// // import { CircularProgress } from '@mui/material';
// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, Link } from '@mui/material';
// // import { createTheme, ThemeProvider } from '@mui/material/styles';


// // const tema = createTheme({
// //   palette: {
// //     primary: {
// //       main: '#424242',
// //     },
// //     secondary: {
// //       main: '#757575',
// //     },
// //     error: {
// //       main: '#ff5252',
// //     },
// //     background: {
// //       default: '#121212',
// //       paper: '#1d1d1d',
// //     },
// //     text: {
// //       primary: '#ffffff',
// //       secondary: '#bdbdbd',
// //     },
// //   },
// //   typography: {
// //     h4: {
// //       fontSize: '2rem',
// //       color: '#e0e0e0',
// //     },
// //   },
// // });

// // const CrearUsuario = () => {
// //   const [formulario, setFormulario] = useState({
// //     nombre: '',
// //     email: '',
// //     fNacimiento: '',
// //     password: '',
// //     password2: '',
// //     patologias:'',
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState([]);
// //   const [mensaje, setMensaje] = useState(null);

// //   const eventoCambio = (e) => {
// //     const { name, value } = e.target;
// //     setFormulario({
// //       ...formulario,
// //       [name]: value,
// //     });
// //   };

// //   const registro = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError([]);
// //     setMensaje(null);

// //     try {
// //       const coinciden = validarPassword(formulario.password, formulario.password2);
// //       if (!coinciden) {
// //         setMensaje('Las contraseñas no coinciden.');
// //         return;
// //       }

// //       await axios.post('http://localhost:3000/api/usuarios/', formulario);
// //       setMensaje('Usuario registrado exitosamente.');
// //     } catch (err) {
// //       let errorMsg = 'Error de conexión';

// //       if (err.response) {
// //         if (err.response.data && err.response.data.errors) {
// //           setError(err.response.data.errors);
// //         } else if (err.response.data && err.response.data.message) {
// //           setError([err.response.data.message]);
// //         } else {
// //           errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
// //           setError([errorMsg]);
// //         }
// //       } else {
// //         setError([errorMsg]);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const validarPassword = (password, password2) => {
// //     return password === password2;
// //   };


// //   return (
// //     <ThemeProvider theme={tema}>
// //       <CssBaseline />
// //       <Grid container component="main" sx={{ height: '100vh' }}>
// //         <Grid item xs={12} component={Paper} elevation={6} square>
// //           {/* <Box
// //             sx={{
// //               my: 8,
// //               mx: 4,
// //               display: 'flex',
// //               flexDirection: 'column',
// //               alignItems: 'center',
// //             }}
// //           > */}
// //             {/* <Typography component="h1" variant="h5">
// //               Registro
// //             </Typography> */}
// //             <Box component="form" noValidate onSubmit={registro} sx={{ mt: 1, width: '100%' }}>
// //               <TextField
// //                 margin="normal"
// //                 required
// //                 fullWidth
// //                 id="nombre"
// //                 label="Nombre completo"
// //                 name="nombre"
// //                 autoComplete="nombre"
// //                 autoFocus
// //                 value={formulario.nombre}
// //                 onChange={eventoCambio}
// //               />
// //               <TextField
// //                 margin="normal"
// //                 required
// //                 fullWidth
// //                 id="email"
// //                 label="Email"
// //                 name="email"
// //                 autoComplete="email"
// //                 value={formulario.email}
// //                 onChange={eventoCambio}
// //               />
// //               <TextField
// //                 margin="normal"
// //                 required
// //                 fullWidth
// //                 id="fechaNacimiento"
// //                 label="Fecha de nacimiento"
// //                 type="date"
// //                 name="fNacimiento"
// //                 InputLabelProps={{
// //                   shrink: true,
// //                 }}
// //                 value={formulario.fNacimiento}
// //                 onChange={eventoCambio}
// //               />
// //               <TextField
// //                 margin="normal"
// //                 required
// //                 fullWidth
// //                 name="password"
// //                 label="Password"
// //                 type="password"
// //                 id="password"
// //                 autoComplete="new-password"
// //                 value={formulario.password}
// //                 onChange={eventoCambio}
// //               />
// //               <TextField
// //                 margin="normal"
// //                 required
// //                 fullWidth
// //                 name="password2"
// //                 label="Repetir Password"
// //                 type="password"
// //                 id="password2"
// //                 autoComplete="new-password"
// //                 value={formulario.password2}
// //                 onChange={eventoCambio}
// //               />
// //                 <TextField
// //                 margin="normal"
// //                 fullWidth
// //                 name="patologias"
// //                 label="Patologias o aclaraciones referentes a su salud"
// //                 type="text"
// //                 id="patologias"
// //                 autoComplete="patologias"
// //                 value={formulario.patologias}
// //                 onChange={eventoCambio}
// //               />
// //               <Button
// //                 type="submit"
// //                 fullWidth
// //                 variant="contained"
// //                 sx={{ mt: 3, mb: 2 }}
// //                 disabled={loading}
// //               >
// //                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
// //               </Button>
// //               {error.length > 0 && (
// //                 <Typography color="error">
// //                   {error.map((e, i) => (
// //                     <div key={i}>{e}</div>
// //                   ))}
// //                 </Typography>
// //               )}
// //               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
// //               <Grid container>
// //               </Grid>
// //             </Box>
// //           {/* </Box> */}
// //         </Grid>
// //       </Grid>
// //     </ThemeProvider>
// //   );
// // };




// // export default CrearUsuario;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
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
//       paper: '#1d1d1d',
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

// const CrearUsuario = ({ idUsuario }) => {
//   const [formulario, setFormulario] = useState({
//     nombre: '',
//     email: '',
//     fNacimiento: '',
//     password: '',
//     password2: '',
//     patologias: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState([]);
//   const [mensaje, setMensaje] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormulario({
//       ...formulario,
//       [name]: value,
//     });
//   };

//   const handleSubmitUsuario = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError([]);
//     setMensaje(null);

//     try {
//       const coincide = validarPassword(formulario.password, formulario.password2);
//       if (!coincide) {
//         setMensaje('Las contraseñas no coinciden.');
//         return;
//       }

//       const response = await axios.post('http://localhost:3000/api/usuarios/', formulario);
//       setMensaje('Usuario registrado exitosamente.');

//      // onRegister(response.data); // Llamar a la función onRegister con los datos del usuario registrado
      
//     } catch (err) {
//       let errorMsg = 'Error de conexión';

//       if (err.response) {
//         if (err.response.data && err.response.data.errors) {
//           setError(err.response.data.errors);
//         } else if (err.response.data && err.response.data.message) {
//           setError([err.response.data.message]);
//         } else {
//           errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
//           setError([errorMsg]);
//         }
//       } else {
//         setError([errorMsg]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validarPassword = (password, password2) => {
//     return password === password2;
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <Grid item xs={12} component={Paper} elevation={6} square>
//           {/* <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
//             <Grid item xs={10} sm={8} md={6} lg={4}> */}
//               <Paper elevation={6} sx={{ p: 4 }}>
//                 <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
//                   Registro
//                 </Typography>
//                 <form onSubmit={handleSubmitUsuario} noValidate>
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="nombre"
//                     label="Nombre completo"
//                     name="nombre"
//                     autoComplete="nombre"
//                     autoFocus
//                     value={formulario.nombre}
//                     onChange={handleChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="email"
//                     label="Email"
//                     name="email"
//                     autoComplete="email"
//                     value={formulario.email}
//                     onChange={handleChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="fNacimiento"
//                     label="Fecha de nacimiento"
//                     type="date"
//                     name="fNacimiento"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     value={formulario.fNacimiento}
//                     onChange={handleChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type="password"
//                     id="password"
//                     autoComplete="new-password"
//                     value={formulario.password}
//                     onChange={handleChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     name="password2"
//                     label="Repetir Password"
//                     type="password"
//                     id="password2"
//                     autoComplete="new-password"
//                     value={formulario.password2}
//                     onChange={handleChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     fullWidth
//                     name="patologias"
//                     label="Patologías o aclaraciones referentes a su salud"
//                     type="text"
//                     id="patologias"
//                     // autoComplete="patologias"
//                     value={formulario.patologias}
//                     onChange={handleChange}
//                   />
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{ mt: 3, mb: 2 }}
//                     disabled={loading}
//                   >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
//                   </Button>
//                   {error.length > 0 && (
//                     <Typography color="error">
//                       {error.map((e, i) => (
//                         <div key={i}>{e}</div>
//                       ))}
//                     </Typography>
//                   )}
//                   {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//                 </form>
//               </Paper>
//             {/* </Grid>
//           </Grid> */}
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default CrearUsuario;

