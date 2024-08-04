// import React, { useState, useEffect ,useCallback} from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';

// const tema = createTheme({
//   palette: {
//     primary: { main: '#424242' },
//     secondary: { main: '#757575' },
//     error: { main: '#ff5252' },
//     background: { default: '#121212', paper: '#1d1d1d' },
//     text: { primary: '#ffffff', secondary: '#bdbdbd' },
//   },
//   typography: {
//     h4: { fontSize: '2rem', color: '#e0e0e0' },
//   },
// });

// const EditarUsuario = () => {
//   const [formulario, setFormulario] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     telefono: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mensaje, setMensaje] = useState(null);
//   const navigate = useNavigate();
//   const [preview, setPreview] = useState(null);

//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', usuario.id); // Enviar el ID del usuario

//     setPreview(URL.createObjectURL(file));

//     const token = localStorage.getItem('token');

//     api.post('/api/usuarios/upload', formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then(response => {
//       console.log('File uploaded successfully', response.data);
//       setMensaje('Imagen subida con éxito');
//     })
//     .catch(error => {
//       console.error('Error uploading file', error);
//       setError('Error al subir la imagen');
//     });
//   }, [usuario.id]);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });


//   useEffect(() => {
//     const obtenerDatosUsuario = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('token');
//         const usuario = JSON.parse(localStorage.getItem('usuario'));

//         // Realiza la solicitud GET para obtener los datos del usuario
//         const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });


//         console.log(respuesta.data.valor);
//         setFormulario({
//           nombre: respuesta.data.valor.nombre || '',
//           email: respuesta.data.valor.email || '',
//           telefono: respuesta.data.valor.telefono || '',
//           password: '', // No mostrar la contraseña actual
//         });
//       } catch (err) {
//         setError('Error al obtener los datos del usuario.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerDatosUsuario();
//   }, []);

//   const eventoCambio = (e) => {
//     setFormulario({
//       ...formulario,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const editarUsuario = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMensaje(null);

//     try {
//       const token = localStorage.getItem('token');
//       const usuario = JSON.parse(localStorage.getItem('usuario'));

//       // const respuesta = await api.put(`/api/usuarios/${usuario.id}`, formulario, {
//       //   headers: { 'Authorization': `Bearer ${token}` },
//       // });
//       const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'usuario': usuario.id
//         }
//       });

//       setMensaje('Usuario editado exitosamente.');
//       setTimeout(() => navigate('/'), 1000); 
//     } catch (err) {
//       let errorMsg = 'Error de conexión';
//       if (err.response) {
//         errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
//       }
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={tema}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
//               Editar Usuario
//             </Typography>
//             <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="nombre"
//                 label="Nombre"
//                 name="nombre"
//                 autoComplete="nombre"
//                 value={formulario.nombre}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 value={formulario.email}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="telefono"
//                 label="Teléfono"
//                 name="telefono"
//                 autoComplete="telefono"
//                 value={formulario.telefono}
//                 onChange={eventoCambio}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 value={formulario.password}
//                 onChange={eventoCambio}
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
//               </Button>
//               {error && (
//                 <Typography color="error">
//                   {error}
//                 </Typography>
//               )}
//               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default EditarUsuario;


// import React, { useState, useEffect, useCallback } from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';

// const tema = createTheme({
//   palette: {
//     primary: { main: '#424242' },
//     secondary: { main: '#757575' },
//     error: { main: '#ff5252' },
//     background: { default: '#121212', paper: '#1d1d1d' },
//     text: { primary: '#ffffff', secondary: '#bdbdbd' },
//   },
//   typography: {
//     h4: { fontSize: '2rem', color: '#e0e0e0' },
//   },
// });

// const EditarUsuario = () => {
//   const [formulario, setFormulario] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     telefono: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mensaje, setMensaje] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', usuario.id); // Enviar el ID del usuario

//     setPreview(URL.createObjectURL(file));
//     setUploading(true);

//     const token = localStorage.getItem('token');
//     const usuario = JSON.parse(localStorage.getItem('usuario'));

//     api.post('/api/usuarios/upload', formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'usuario': usuario.id,
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then(response => {
//       console.log('File uploaded successfully', response.data);
//       setMensaje('Imagen subida con éxito');
//     })
//     .catch(error => {
//       console.error('Error uploading file', error);
//       setError('Error al subir la imagen');
//     })
//     .finally(() => {
//       setUploading(false);
//     });
//   }, [usuario.id]);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   useEffect(() => {
//     const obtenerDatosUsuario = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('token');

//         // Realiza la solicitud GET para obtener los datos del usuario
//         const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });

//         setFormulario({
//           nombre: respuesta.data.valor.nombre || '',
//           email: respuesta.data.valor.email || '',
//           telefono: respuesta.data.valor.telefono || '',
//           password: '', // No mostrar la contraseña actual
//         });
//       } catch (err) {
//         setError('Error al obtener los datos del usuario.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerDatosUsuario();
//   }, [usuario.id]);

//   const eventoCambio = (e) => {
//     setFormulario({
//       ...formulario,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const editarUsuario = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMensaje(null);

//     try {
//       const token = localStorage.getItem('token');

//       const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });

//       setMensaje('Usuario editado exitosamente.');
//       setTimeout(() => navigate('/'), 1000); 
//     } catch (err) {
//       let errorMsg = 'Error de conexión';
//       if (err.response) {
//         errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
//       }
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={tema}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
//               Editar Usuario
//             </Typography>
//             <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="nombre"
//                 label="Nombre"
//                 name="nombre"
//                 autoComplete="nombre"
//                 value={formulario.nombre}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 value={formulario.email}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="telefono"
//                 label="Teléfono"
//                 name="telefono"
//                 autoComplete="telefono"
//                 value={formulario.telefono}
//                 onChange={eventoCambio}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 value={formulario.password}
//                 onChange={eventoCambio}
//               />
//               <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #757575', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
//                 <input {...getInputProps()} />
//                 <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen</p>
//               </div>
//               {preview && <img src={preview} alt="Vista previa" style={{ width: '100%', marginTop: '20px' }} />}
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 disabled={loading || uploading}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
//               </Button>
//               {error && (
//                 <Typography color="error">
//                   {error}
//                 </Typography>
//               )}
//               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default EditarUsuario;



// import React, { useState, useEffect, useCallback } from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress, Avatar } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';

// const tema = createTheme({
//   palette: {
//     primary: { main: '#424242' },
//     secondary: { main: '#757575' },
//     error: { main: '#ff5252' },
//     background: { default: '#121212', paper: '#1d1d1d' },
//     text: { primary: '#ffffff', secondary: '#bdbdbd' },
//   },
//   typography: {
//     h4: { fontSize: '2rem', color: '#e0e0e0' },
//   },
// });

// const EditarUsuario = () => {
//   const [formulario, setFormulario] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     telefono: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mensaje, setMensaje] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const navigate = useNavigate();

//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', usuario.id);

//     setPreview(URL.createObjectURL(file));

//     const token = localStorage.getItem('token');

//     api.post('/api/usuarios/upload', formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then(response => {
//       console.log('File uploaded successfully', response.data);
//       setMensaje('Imagen subida con éxito');
//     })
//     .catch(error => {
//       console.error('Error uploading file', error);
//       setError('Error al subir la imagen');
//     });
//   }, [usuario.id]);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   useEffect(() => {
//     const obtenerDatosUsuario = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('token');
//         const usuario = JSON.parse(localStorage.getItem('usuario'));

//         const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         console.log("imagen " + respuesta.data.valor.profileImage);

//         setFormulario({
//           nombre: respuesta.data.valor.nombre || '',
//           email: respuesta.data.valor.email || '',
//           telefono: respuesta.data.valor.telefono || '',
//           password: '',
//         });

//         if (respuesta.data.valor.profileImage) {
//           setPreview(respuesta.data.valor.profileImage); // Suponiendo que el campo de la imagen se llama 'imagen'
//         }
//       } catch (err) {
//         setError('Error al obtener los datos del usuario.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerDatosUsuario();
//   }, []);

//   const eventoCambio = (e) => {
//     setFormulario({
//       ...formulario,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const editarUsuario = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMensaje(null);

//     try {
//       const token = localStorage.getItem('token');
//       const usuario = JSON.parse(localStorage.getItem('usuario'));

//       const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'usuario': usuario.id
//         }
//       });

//       setMensaje('Usuario editado exitosamente.');
//       setTimeout(() => navigate('/'), 1000); 
//     } catch (err) {
//       let errorMsg = 'Error de conexión';
//       if (err.response) {
//         errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
//       }
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={tema}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
//               Editar Usuario
//             </Typography>
//             <div {...getRootProps()} style={{ border: '2px dashed #757575', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', cursor: 'pointer' }}>
//               <input {...getInputProps()} />
//               {preview ? (
//                 <Avatar src={preview} alt="Preview" sx={{ width: 150, height: 150 }} />
//               ) : (
//                 <Typography>Click para subir tu foto!</Typography>
//               )}
//             </div>
//             <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="nombre"
//                 label="Nombre"
//                 name="nombre"
//                 autoComplete="nombre"
//                 value={formulario.nombre}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 value={formulario.email}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="telefono"
//                 label="Teléfono"
//                 name="telefono"
//                 autoComplete="telefono"
//                 value={formulario.telefono}
//                 onChange={eventoCambio}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 value={formulario.password}
//                 onChange={eventoCambio}
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
//               </Button>
//               {error && (
//                 <Typography color="error">
//                   {error}
//                 </Typography>
//               )}
//               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default EditarUsuario;


// import React, { useState, useEffect, useCallback } from 'react';
// import api from '../configuracion/axiosconfig';
// import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress, Avatar } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';

// const tema = createTheme({
//   palette: {
//     primary: { main: '#424242' },
//     secondary: { main: '#757575' },
//     error: { main: '#ff5252' },
//     background: { default: '#121212', paper: '#1d1d1d' },
//     text: { primary: '#ffffff', secondary: '#bdbdbd' },
//   },
//   typography: {
//     h4: { fontSize: '2rem', color: '#e0e0e0' },
//   },
// });

// const EditarUsuario = () => {
//   const [formulario, setFormulario] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     telefono: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mensaje, setMensaje] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const navigate = useNavigate();

//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', usuario.id);

//     setPreview(URL.createObjectURL(file));

//     const token = localStorage.getItem('token');

//     api.post('/api/usuarios/upload', formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then(response => {
//       console.log('File uploaded successfully', response.data);
//       setMensaje('Imagen subida con éxito');
//       setPreview(response.data.filePath); 
//     })
//     .catch(error => {
//       console.error('Error uploading file', error);
//       setError('Error al subir la imagen');
//     });
//   }, [usuario.id]);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   useEffect(() => {
//     const obtenerDatosUsuario = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('token');
//         const usuario = JSON.parse(localStorage.getItem('usuario'));

//         const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });

//         setFormulario({
//           nombre: respuesta.data.valor.nombre || '',
//           email: respuesta.data.valor.email || '',
//           telefono: respuesta.data.valor.telefono || '',
//           password: '',
//         });

//         if (respuesta.data.valor.profileImage) {
//           console.log(respuesta.data.valor.profileImage);
//           const imageUrl = `http://localhost:3000/${respuesta.data.valor.profileImage}`;
//           setPreview(imageUrl); 
//           console.log(preview);
//         }
//       } catch (err) {
//         setError('Error al obtener los datos del usuario.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     obtenerDatosUsuario();
//   }, []);

//   const eventoCambio = (e) => {
//     setFormulario({
//       ...formulario,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const editarUsuario = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMensaje(null);

//     try {
//       const token = localStorage.getItem('token');
//       const usuario = JSON.parse(localStorage.getItem('usuario'));

//       const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'usuario': usuario.id
//         }
//       });

//       setMensaje('Usuario editado exitosamente.');
//       setTimeout(() => navigate('/'), 1000); 
//     } catch (err) {
//       let errorMsg = 'Error de conexión';
//       if (err.response) {
//         errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
//       }
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={tema}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//             <div {...getRootProps()} style={{ border: '2px dashed #757575', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', cursor: 'pointer' }}>
//               <input {...getInputProps()} />
//               {preview ? (
//                 <Avatar src={preview} alt="Preview" sx={{ width: 150, height: 150 }} />
//               ) : (
//                 <Typography>Click para subir tu foto!</Typography>
//               )}
//             </div>
//             <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="nombre"
//                 label="Nombre"
//                 name="nombre"
//                 autoComplete="nombre"
//                 value={formulario.nombre}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 value={formulario.email}
//                 onChange={eventoCambio}
//                 disabled
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="telefono"
//                 label="Teléfono"
//                 name="telefono"
//                 autoComplete="telefono"
//                 value={formulario.telefono}
//                 onChange={eventoCambio}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 value={formulario.password}
//                 onChange={eventoCambio}
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
//               </Button>
//               {error && (
//                 <Typography color="error">
//                   {error}
//                 </Typography>
//               )}
//               {mensaje && <Typography color="success.main">{mensaje}</Typography>}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default EditarUsuario;


import React, { useState, useEffect, useCallback } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const tema = createTheme({
  palette: {
    primary: { main: '#424242' },
    secondary: { main: '#757575' },
    error: { main: '#ff5252' },
    background: { default: '#121212', paper: '#1d1d1d' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
  },
  typography: {
    h4: { fontSize: '2rem', color: '#e0e0e0' },
  },
});

const EditarUsuario = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', usuario.id);

    setPreview(URL.createObjectURL(file));

    const token = localStorage.getItem('token');

    api.post('/api/usuarios/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log('File uploaded successfully', response.data);
      setMensaje('Imagen subida con éxito');
      const imageUrl = `http://localhost:3000/${response.data.filePath}`; // Cambia 'localhost:3000' por tu URL base si es necesario
      console.log(`http://localhost:3000/${response.data.filePath}`); 
      setPreview(imageUrl);
    })
    .catch(error => {
      console.error('Error uploading file', error);
      setError('Error al subir la imagen');
    });
  }, [usuario.id]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setFormulario({
          nombre: respuesta.data.valor.nombre || '',
          email: respuesta.data.valor.email || '',
          telefono: respuesta.data.valor.telefono || '',
          password: '',
        });

        if (respuesta.data.valor.profileImage) {
          console.log(respuesta.data.valor.profileImage);
          setPreview(respuesta.data.valor.profileImage);
        }
      } catch (err) {
        setError('Error al obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const editarUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'usuario': usuario.id
        }
      });

      setMensaje('Usuario editado exitosamente.');
      setTimeout(() => navigate('/'), 1000); 
    } catch (err) {
      let errorMsg = 'Error de conexión';
      if (err.response) {
        errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={tema}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} component={Paper} elevation={6} square>
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
              Editar Usuario
            </Typography>
            <div {...getRootProps()} style={{ border: '2px dashed #757575', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {preview ? (
                <Avatar src={preview} alt="Preview" sx={{ width: 150, height: 150 }} />
              ) : (
                <Typography>Click para subir tu foto!</Typography>
              )}
            </div>
            <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="nombre"
                value={formulario.nombre}
                onChange={eventoCambio}
                disabled
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formulario.email}
                onChange={eventoCambio}
                disabled
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                value={formulario.telefono}
                onChange={eventoCambio}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formulario.password}
                onChange={eventoCambio}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
              </Button>
              {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}
              {mensaje && <Typography color="success.main">{mensaje}</Typography>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default EditarUsuario;
